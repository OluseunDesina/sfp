import { Component, OnInit } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { UserService } from "../../user.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { MatDialog } from "@angular/material/dialog";
import { StaffCreateComponent } from "../staff-create/staff-create.component";
import { Observable } from "rxjs/Observable";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";

@Component({
  selector: "app-staff-list",
  templateUrl: "./staff-list.component.html",
  styleUrls: ["./staff-list.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class StaffListComponent implements OnInit {
  tableLoading: boolean = true;
  title = "Pupil List";
  dataSource: any[] = [];
  displayedColumns: any[] = [
    "name",
    "department",
    "email",
    "phone_number",
    "balance",
    // "staff_level",
    "last_login",
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
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUserGroup();
    this.getStaffList();
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
      this.getStaffList();
    }
  }

  getStaffList() {
    this.userService.getStaffList(this.pageSize, this.pageIndex);
    this.userService.getStaffListUpdate().subscribe((staff) => {
      this.dataSource = staff.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
      this.length = staff.count;
      this.tableLoading = false;
    });
  }

  pageChange(value: { pageSize: number; pageIndex: number; }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getStaffList();
  }

  deactivateUser(user) {
    this.tableLoading = true;
    user.is_active = !user.is_active;
    this.userService.deactivateUser(user).subscribe(() => {
      this.getStaffList();
    });
  }

  onEditUser(user) {
    this.dialog
      .open(StaffCreateComponent, { data: user })
      .afterClosed()
      .subscribe(() => {
        this.getStaffList();
      });
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
