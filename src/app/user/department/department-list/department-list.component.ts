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

@Component({
  selector: "app-department-list",
  templateUrl: "./department-list.component.html",
  styleUrls: ["./department-list.component.scss"],
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
export class DepartmentListComponent implements OnInit {
  private pageSize: number;
  private pageIndex: number;
  length: number;
  tableLoading: boolean = true;
  title = "Department List";
  dataSource: any[] = [];
  displayedColumns: any[] = ["name"];
  expandedElement: any;
  isComp: boolean;
  isSid: boolean;
  companyList: any[];
  isAcct: boolean;

  constructor(
    private userService: UserService,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.getDepartmentList();
    this.getuserGroup();
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "cmp_adm":
        this.isComp = true;
        this.displayedColumns = ["name"];
        break;
      case "cmp_act":
        this.isAcct = true;
        this.displayedColumns = ["name"];
        break;
      case "sid":
        this.isSid = true;
        this.displayedColumns = ["company_name", "name"];
        this.getCompanyList();
        break;

      default:
        break;
    }
  }

  getCompanyList() {
    this.userService.getCompanyList(this.pageSize, this.pageIndex);
    this.userService.getCompanyListUpdate().subscribe((datasource) => {
      this.companyList = datasource.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
      this.length = datasource.count;
    });
  }

  getDepartmentList() {
    this.userService.getDepartments(this.pageSize, this.pageIndex);
    this.userService.getDepartmentsUpdate().subscribe((departments) => {
      this.dataSource = departments.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
      this.length = departments.count;
      this.tableLoading = false;
    });
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getDepartmentList();
  }
}
