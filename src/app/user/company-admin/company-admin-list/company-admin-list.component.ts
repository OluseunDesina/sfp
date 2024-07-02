import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "../../user.service";

@Component({
  selector: "app-company-admin-list",
  templateUrl: "./company-admin-list.component.html",
  styleUrls: ["./company-admin-list.component.scss"],
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
export class CompanyAdminListComponent implements OnInit {
  companyArray: any[];
  downloading;
  private pageSize: number;
  private pageIndex: number;
  length: number;
  tableLoading: boolean = true;
  title = "school admin list";
  dataSource: any[] = [];
  displayedColumns: any[] = [];
  expandedElement: any;
  isComp: boolean;
  isSid: boolean;
  company: any;

  constructor(
    private userService: UserService,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.getCompanyAdminList();
    this.getuserGroup();
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "cmp_adm":
        this.isComp = true;
        this.displayedColumns = [
          "contact_name",
          "contact_email",
          "staff_id",
          "sex",
          "last_login",
        ];
        break;
      case "sid":
        this.isSid = true;
        this.displayedColumns = [
          // "position",
          "company_name",
          "contact_name",
          "contact_email",
          "actual_balance",
          "staff_id",
          "sex",
          "last_login",
        ];
        this.getCompanyList();
        break;

      default:
        break;
    }
  }

  companyChange(value) {
    this.company = value;
    this.getCompanyAdminList();
  }

  getCompanyList() {
    this.userService.getCompanyList(this.pageSize, this.pageIndex);
    this.userService.getCompanyListUpdate().subscribe((datasource) => {
      this.companyArray = [
        { name: "All Companies", id: null },
        ...datasource.results,
      ];
      this.length = datasource.count;
    });
  }

  getCompanyAdminList() {
    this.userService.getCompanyAdminList(
      this.pageSize,
      this.pageIndex,
      this.company
    );
    this.userService.getCompanyAdminListUpdate().subscribe((datasource) => {
      this.dataSource = datasource.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
      this.length = datasource.count;
      this.tableLoading = false;
    });
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getCompanyAdminList();
  }
}
