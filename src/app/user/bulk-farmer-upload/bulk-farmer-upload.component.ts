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
  selector: 'app-bulk-farmer-upload',
  templateUrl: './bulk-farmer-upload.component.html',
  styleUrls: ['./bulk-farmer-upload.component.scss'],
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
export class BulkFarmerUploadComponent implements OnInit {
  title = "Upload Farmer";
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
    // this.form = this.formBuilder.group({
    //   employees: this.formBuilder.array([])
    // });
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
              firstname: [""],
              lastname: [""],
              middlename: [""],
              dob: [""],
              nin: [""],
              school: [""],
              state: [""],
              city: [""],
              lga: [""],
              ward: [""],
              student_class: [""],
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
    this.userService.uploadFarmer({
      schools: [],
      caterers: [],
      students: [],
      farmers: this.htmlWorkbookJSON.map(item => ({
        firstname: `${item["FARMER FIRST NAME"]}`,
        middlename: `${item["FARMER MIDDLE NAME"]}`,
        lastname: `${item["FARMER LAST NAME"]}`,
        nin: `${item["NIN"]}`,
        state: `${item["STATE"].toUpperCase()}`,
        city: `${item["TOWN"].toUpperCase()}`,
        lga: `${item["LG"].toUpperCase()}`,
        ward: `${item["WARD"].toLowerCase()}`,
        address: `${item["FARMER ADDRESS"].toUpperCase()}`,
      })),
    });
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

