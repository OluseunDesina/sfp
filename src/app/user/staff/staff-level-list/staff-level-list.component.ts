import { Component, OnInit } from "@angular/core";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "../../user.service";

@Component({
  selector: "app-staff-level-list",
  templateUrl: "./staff-level-list.component.html",
  styleUrls: ["./staff-level-list.component.scss"],
})
export class StaffLevelListComponent implements OnInit {
  tableLoading: boolean = true;
  title = "Staff Levels";
  dataSource: any[] = [];
  displayedColumns: any[] = [
    "name",
    "department",
    "balance",
    "staff_level",
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

  constructor(
    private userService: UserService,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.getUserGroup();
    this.getStaffLevelList();
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

  getStaffLevelList() {
    this.userService
      .getStaffLevels()
      // this.userService.getStaffListUpdate()
      .subscribe((staff) => {
        this.dataSource = staff.results.map((element, index) => {
          return { ...element, position: index + 1 };
        });
        this.length = staff.count;
        this.tableLoading = false;
      });
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getStaffLevelList();
  }
}
