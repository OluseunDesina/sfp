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
  selector: "app-accountant-list",
  templateUrl: "./accountant-list.component.html",
  styleUrls: ["./accountant-list.component.scss"],
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
export class AccountantListComponent implements OnInit {
  private pageSize: number;
  private pageIndex: number;
  length: number;
  tableLoading: boolean = true;
  title = "Accountant List";
  dataSource: any[] = [];
  displayedColumns: any[] = [];
  expandedElement: any;
  companyArray: any[];
  isComp: boolean;
  isSid: boolean;
  company: any;
  downloading;
  //

  constructor(
    private userService: UserService,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.getAccountantList();
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
    this.getAccountantList();
  }

  getCompanyList() {
    this.userService.getCompanyList(this.pageSize, this.pageIndex);
    this.userService.getCompanyListUpdate().subscribe((datasource) => {
      this.companyArray = datasource.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
      this.length = datasource.count;
    });
  }

  getAccountantList() {
    this.userService.getAccountantList(
      this.pageSize,
      this.pageIndex,
      this.company
    );
    this.userService.getAccountantUpdate().subscribe((accountant) => {
      this.dataSource = accountant.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
      this.length = accountant.count;
      this.tableLoading = false;
    });
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getAccountantList();
  }
}
