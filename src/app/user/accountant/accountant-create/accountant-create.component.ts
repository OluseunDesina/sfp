import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "../../user.service";
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from "ngx-intl-tel-input";
import { ErrorService } from "src/app/shared/services/error.service";

@Component({
  selector: "app-accountant-create",
  templateUrl: "./accountant-create.component.html",
  styleUrls: ["./accountant-create.component.scss"],
})
export class AccountantCreateComponent implements OnInit {
  companyList: any[] = [];
  sexList: any[] = [
    {
      name: "Male",
      id: "male",
    },
    {
      name: "Female",
      id: "female",
    },
  ];
  departmentList: any[] = [];
  staffLevelList: any[] = [];
  title = "create company accountant";
  errorMessage: string;

  contactForm: FormGroup = new FormGroup({});
  companyForm: FormGroup = new FormGroup({});
  othersForm: FormGroup = new FormGroup({});
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
  isComp: boolean;
  isSid: boolean;
  isLoading: boolean;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private helperService: HelperService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.errorService.getErrorListener().subscribe((error) => {
      this.errorMessage = error;
      this.isLoading = false;
    });
    this.contactForm = this.fb.group({
      first_name: [
        "",
        [Validators.required, Validators.pattern(this.namePattern)],
      ],
      last_name: [
        "",
        [Validators.required, Validators.pattern(this.namePattern)],
      ],
      email: ["", [Validators.required, Validators.pattern(this.emailRegEx)]],
      phone_number: ["", [Validators.required]],
    });
    this.companyForm = this.fb.group({
      company: ["", [Validators.required]],
      staff_level: ["", [Validators.required]],
      staff_id: ["", [Validators.required]],
      // department: ["", [Validators.required]],
    });
    this.othersForm = this.fb.group({
      sex: [""],
      date_of_birth: [""],
    });

    this.getuserGroup();
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "cmp_adm":
        this.isComp = true;
        this.getstaffLevel();
        const user = this.helperService.getUserInfo();
        this.companyForm.get("company").patchValue(user.id);
        this.companyForm.get("company").updateValueAndValidity();
        break;
      case "sid":
        this.isSid = true;
        this.getCompanyList();
        this.getstaffLevel();
        break;

      default:
        break;
    }
  }

  validateForm(form) {
    this.helperService.validateAllFormFields(form);
  }

  getCompanyList() {
    this.userService.getCompanyList();
    this.userService.getCompanyListUpdate().subscribe((companyList) => {
      this.companyList = companyList.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
    });
  }

  getstaffLevel() {
    this.userService.getStaffLevels().subscribe((staffLevel) => {
      this.staffLevelList = staffLevel.results;
    });
  }

  onSetDate(value) {
    const date = this.helperService.formatDate(value.value);
    this.othersForm.patchValue({ date_of_birth: date });
  }

  onSave(stepper: MatStepper) {
    if (this.contactForm.invalid) {
      this.validateForm(this.contactForm);
      // open step 1
      stepper.selectedIndex = 0;
    } else if (this.companyForm.invalid) {
      this.validateForm(this.companyForm);
      // open step 2
      stepper.selectedIndex = 1;
    } else if (this.othersForm.invalid) {
      this.validateForm(this.othersForm);
      // open step 3
      stepper.selectedIndex = 2;
    } else {
      this.isLoading = true;
      let phone_number =
        this.contactForm.value.phone_number.phone ||
        this.contactForm.value.phone_number.number;
      let contactForm = this.contactForm.value;
      contactForm.phone_number = phone_number;
      this.userService.createAccountant({
        ...contactForm,
        ...this.companyForm.value,
        ...this.othersForm.value,
      });
    }
  }
}
