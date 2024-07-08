import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  tableLoading: boolean = true;
  title = "Pupil List";
  dataSource: any[] = [];
  displayedColumns: any[] = [
    "name",
    "nin",
    "dob",
    "class",
    "school",
    "date_created",
    "state",
    "lga",
    "ward",
    "star",
  ];
  expandedElement: any;
  length: number;
  pageSize: number;
  pageIndex: number;

  isStaff: boolean;
  isSid: boolean;
  isComp: boolean;
  isVend: boolean;
  isAcct: boolean;

  searchPlaceHolder: string = "Search by User email or Phone";
  downloading: boolean;

  constructor(
    private userService: UserService,
    private helperService: HelperService,
    // private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUserGroup();
    this.getStudentList();
  }

  getUserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "emp":
        this.isStaff = true;
        break;
      case "ven":
        this.isVend = true;
        break;
      case "cmp_adm":
        this.isComp = true;
        break;
      case "cmp_act":
        this.isAcct = true;
        break;
      case "sid":
        this.isSid = true;
        break;

      default:
        break;
    }
  }

  onSearch(value) {
    if (value) {
      this.userService.seaarchStaffList(value, this.pageSize, this.pageIndex);
    } else {
      this.getStudentList();
    }
  }

  getStudentList() {
    this.userService.getStudentList(this.pageSize, this.pageIndex)
    // this.userService.getStaffListUpdate()
    .subscribe((students) => {
      this.dataSource = students.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
      this.length = students.count;
      this.tableLoading = false;
    });
  }

  pageChange(value: { pageSize: number; pageIndex: number; }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getStudentList();
  }

  deactivateUser(user) {
    this.tableLoading = true;
    user.is_active = !user.is_active;
    this.userService.deactivateUser(user).subscribe(() => {
      this.getStudentList();
    });
  }

  onEditUser(user) {
    // this.dialog
    //   .open(StaffCreateComponent, { data: user })
    //   .afterClosed()
    //   .subscribe(() => {
    //     this.getStaffList();
    //   });
  }

  onExportExcel() {
    this.downloading = !this.downloading;
    let data;
    this.userService.downloadStaffList(this.length, this.pageIndex).subscribe(
      (res) => {
        data = res.results.map((element) => {
          return {
            name: `${element.first_name} ${element.last_name}`,
            department: element.department,
            email: element.email,
            phone_number: `${element.phone_number}`,
            balance: `${element.balance}`,
            staff_level: element.staff_level,
            last_login: element.last_login,
          };
        });
        this.helperService.exportExcel(
          data,
          "staff-list",
          this.displayedColumns
        );
        this.downloading = !this.downloading;
      },
      (err) => { }
    );
  }
}
