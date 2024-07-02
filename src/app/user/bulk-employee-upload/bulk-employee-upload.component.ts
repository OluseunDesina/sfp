import { Component, OnInit } from "@angular/core";
import { HelperService } from "src/app/shared/services/helper.service";
import * as XLSX from "xlsx";
import { UserService } from "../user.service";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  stagger,
  query,
  // ...
} from "@angular/animations";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { User } from "src/app/shared/models/vendor.model";

@Component({
  selector: "app-bulk-employee-upload",
  templateUrl: "./bulk-employee-upload.component.html",
  styleUrls: ["./bulk-employee-upload.component.scss"],
  animations: [
    // animation triggers go here
    // three states 1. added 2. upload 3. deleted.
    trigger("forFadeSlideInOut", [
      // transition(":enter", [
      //   style({ opacity: 0, transform: "translateY(10px)" }),
      //   animate("500ms", style({ opacity: 1, transform: "translateY(0)" })),
      // ]),
      transition(":leave", [
        animate("300ms", style({ opacity: 0, transform: "translateY(10px)" })),
      ]),
    ]),

    trigger("ifFadeSlideInOut", [
      transition(":enter", [
        query(":enter", [
          style({ opacity: 0, transform: "translateY(10px)" }),
          stagger(
            "100ms",
            animate("100ms", style({ opacity: 1, transform: "translateY(0)" }))
          ),
        ]),
      ]),
      // transition(":leave", [
      //   query(':leave', [
      //     style({opacity: 1}),
      //     stagger("500ms", animate("500ms", style({ opacity: 0, transform: "translateY(10px)" })),)
      //   ])
      // ]),
    ]),

    //   trigger('fadeInGrow', [
    //     transition(':enter', [
    //         query(':enter', [
    //             style({ opacity: 0 }),
    //             stagger('50ms', [
    //               animate('500ms', style({ opacity: 1 })
    //             ])
    //         ])
    //     ])
    // ])
  ],
})
export class BulkEmployeeUploadComponent implements OnInit {
  title = "create student";
  form: FormGroup;
  htmlWorkbookJSON: User[] = [];
  displayedColumns = ["firstname", "lastname", "email", "action"];
  selectedFile: File;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    // this.form = this.formBuilder.group({
    //   employees: this.formBuilder.array([])
    // });
  }

  onFileSelected(event) {
    const files = (event.target as HTMLInputElement).files;
    // this.uploadingExcel()
    // this.ngxService.startBackground('file-upload');
    // this.htmlWorkbookJSON = {};
    this.selectedFile = files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      /* DO SOMETHING WITH workbook HERE */
      const first_sheet_name = workbook.SheetNames[0];
      /* Get worksheet */
      const worksheet = workbook.Sheets[first_sheet_name];
      const jsonData: User[] = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
      });
      this.htmlWorkbookJSON = jsonData;
      // const fgs = this.htmlWorkbookJSON.map(User.asFormGroup);
      // this.form.setControl("employees", new FormArray(fgs));
      this.form = this.formBuilder.group({
        employees: this.formBuilder.array(
          [
            this.formBuilder.group({
              first_name: ["", [Validators.required]],
              last_name: ["", [Validators.required]],
              email: [""],
              phone_number: [""],
            }),
          ]
          // this.htmlWorkbookJSON.map((r) => this.formBuilder.group(r))
        ),
      });
      // this.staffsReady = true;
      // this.stopSpinner()
    };
    reader.readAsArrayBuffer(this.selectedFile);
  }

  removeStaff(i) {
    const newJsonData = this.htmlWorkbookJSON.filter(
      (element, index) => index !== i
    );
    this.htmlWorkbookJSON = newJsonData;
  }

  get employees() {
    return this.form.get("employees") as FormArray;
  }

  uploadStaffsInfo() {
    this.userService.uploadStaff({ employees: this.htmlWorkbookJSON });
    this.userService.getStaffCreationErrorUpdate().subscribe((errorArray) => {
      let newArray = this.htmlWorkbookJSON.filter((element, index) => {
        if (errorArray[index].error) {
          element.comment = errorArray[index].error;
          return element;
        }
      });
      this.htmlWorkbookJSON = newArray;
    });
  }
}
