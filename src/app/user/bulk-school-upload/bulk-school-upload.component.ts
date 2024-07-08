import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  trigger,
  style,
  animate,
  transition,
  stagger,
  query,
} from "@angular/animations";
import { UserService } from '../user.service';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-bulk-school-upload',
  templateUrl: './bulk-school-upload.component.html',
  styleUrls: ['./bulk-school-upload.component.scss'],
  animations: [
    // animation triggers go here
    // three states 1. added 2. upload 3. deleted.
    trigger("forFadeSlideInOut", [
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
    ]),
  ],
})
export class BulkSchoolUploadComponent implements OnInit {
  title = "Upload Pupils";
  form: FormGroup;
  htmlWorkbookJSON!: any[];
  displayedColumns = ["firstname", "lastname", "email", "action"];
  selectedFile: File;
  isLoading: boolean;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
  }

  onFileSelected(event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.selectedFile = input.files[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      /* DO SOMETHING WITH workbook HERE */
      const first_sheet_name = workbook.SheetNames[0];
      /* Get worksheet */
      const worksheet = workbook.Sheets[first_sheet_name];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
        header: 1,
      });

      const [headers, ...dataRows] = jsonData;
      const formattedData = dataRows.map((row: any[]) => {
        const student: { [key: string]: any } = {};
        headers.forEach((header: string, index: number) => {
          student[header] = row[index];
        });
        return student;
      });
      this.htmlWorkbookJSON = formattedData;
      console.log(this.htmlWorkbookJSON);

      this.form = this.formBuilder.group({
        students: this.formBuilder.array(
          [
            this.formBuilder.group({
              head_teacher_firstname: [""],
              head_teacher_middlename: [""],
              head_teacher_lastname: [""],
              head_teacher_phone: [""],
              head_teacher_nin: [""],
              asst_head_teacher_firstname: [""],
              asst_head_teacher_middlename: [""],
              asst_head_teacher_lastname: [""],
              asst_head_teacher_phone: [""],
              asst_head_teacher_nin: [""],
              school: [""],
              address: [""],
              state: [""],
              city: [""],
              lga: [""],
              ward: [""],
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
    return this.form.get("students") as FormArray;
  }

  uploadStaffsInfo() {
    this.isLoading = true
    this.userService.uploadSchools({
      schools: this.htmlWorkbookJSON.map(item => ({
        head_teacher_firstname: `${item["HEAD TEACHER FIRST NAME"]}`,
        head_teacher_middlename: `${item["HEAD TEACHER MIDDLE NAME"]}`,
        head_teacher_lastname: `${item["HEAD TEACHER LAST NAME"]}`,
        head_teacher_phone: `${item["HEAD TEACHER PHONE"]}`,
        head_teacher_nin: `${item["HEAD TEACHER NIN"]}`,
        asst_head_teacher_firstname: `${item["ASSIST. HEAD TEACHER FIRST NAME"]}`,
        asst_head_teacher_middlename: `${item["ASSIST. HEAD TEACHER MIDDLE NAME"]}`,
        asst_head_teacher_lastname: `${item["ASSIST. HEAD TEACHER LAST NAME"]}`,
        asst_head_teacher_phone: `${item["ASSIST. HEAD TEACHER PHONE"]}`,
        asst_head_teacher_nin: `${item["ASSIST. HEAD TEACHER NIN"]}`,
        school: `${item["NAME OF SCHOOL"]}`,
        state: `${item["STATE"]}`,
        city: `${item["CITY"]}`,
        lga: `${item["LG"]}`,
        ward: `${item["WARD"]}`,
        address: `${item["ADDRESS"]}`
      })),
      farmers: [],
      caterers: [],
      students: [],
    })
    this.userService.getStaffCreationErrorUpdate().subscribe((errorArray) => {
    this.isLoading = false
    let newArray = this.htmlWorkbookJSON.filter((element: any, index) => {
        if (errorArray[index].error) {
          element.comment = errorArray[index].error;
          return element;
        }
      });
      this.htmlWorkbookJSON = newArray;
    });
  }
}
