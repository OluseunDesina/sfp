import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "../../user.service";
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from "ngx-intl-tel-input";
import * as XLSX from "xlsx";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-staff-create",
  templateUrl: "./staff-create.component.html",
  styleUrls: ["./staff-create.component.scss"],
})
export class StaffCreateComponent implements OnInit {
  companyList: any[] = [];
  departmentList: any[] = [];
  staffLevelList: any[] = [];
  title = "create staff";
  isloading: boolean = false;

  form: FormGroup = new FormGroup({});
  private namePattern = "[a-zA-Z][a-zA-Z ]+[a-zA-Z]$";
  private emailRegEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  htmlWorkbookJSON: {};
  selectedFile: File;
  disable_edit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<StaffCreateComponent>
  ) {}

  ngOnInit(): void {
    this.checkMode();
    this.getDepartmentList();
    this.getStaffLevelList();
  }

  checkMode() {
    console.log(this.data);
    if (this.data) {
      this.form = this.fb.group({
        first_name: [this.data?.first_name, [Validators.required]],
        last_name: [this.data?.last_name, [Validators.required]],
        email: [
          this.data?.email,
          [Validators.required, Validators.pattern(this.emailRegEx)],
        ],
        phone_number: [this.data?.phone_number, [Validators.required]],
        id: [this.data?.id, [Validators.required]],
        staff_level: [this.data?.staff_level_full?.id, [Validators.required]],
        department: [this.data?.department_full?.id, [Validators.required]],
      });
    }

    if (this.data.biometrics_a == null || this.data.biometrics_a == "")
      this.disable_edit = true;
  }

  validateForm(form) {
    this.helperService.validateAllFormFields(form);
  }

  getDepartmentList() {
    this.userService.getDepartments(100, 1);
    this.userService.getDepartmentsUpdate().subscribe((departments) => {
      this.departmentList = departments.results;
    });
  }
  getStaffLevelList() {
    this.userService.getStaffLevels().subscribe((staff) => {
      this.staffLevelList = staff.results;
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      return;
    }
    if (this.disable_edit) return;
    this.isloading = true;
    this.userService.updateStaff(this.form.value).subscribe(
      (response) => {
        this.notificationService.success(
          `Success`,
          `staff account update successful`
        );
        this.isloading = false;
        this.dialogRef.close();
      },
      (err) => {
        this.isloading = false;
        this.notificationService.danger(
          `Error`,
          `staff account update unsuccessful`
        );
      }
    );
  }
}
