import { Component, OnInit } from "@angular/core";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "src/app/user/user.service";
import { TotalCost, TotalCostResponse } from "../total-cost";
import { TransactionService } from "../transaction.service";

@Component({
  selector: "app-total-cost",
  templateUrl: "./total-cost.component.html",
  styleUrls: ["./total-cost.component.scss"],
})
export class TotalCostComponent implements OnInit {
  dataSource: TotalCost[] = [];
  tableLoading: boolean = true;
  title = "Total Cost";
  displayedColumns: any[] = [];
  length: number;
  downloading = false;

  private pageSize: number;
  private pageIndex: number;
  private startDate: string;
  private endDate: string;
  private status: string = "";
  private company: string = "";

  isStaff: boolean;
  isSid: boolean;
  isComp: boolean;
  isVend: boolean;
  isAcct: boolean;
  companyArray: { name: any; id: any }[];
  searchPlaceHolder: string = "Search by user eamil or phone";
  searchText: string = "";

  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.startDate = this.endDate = this.helperService.formatDate(new Date());
    this.getuserGroup();
    this.getTotalCost();
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "emp":
        this.isStaff = true;
        this.displayedColumns = [];
        break;
      case "ven":
        this.isVend = true;
        this.displayedColumns = [];
        break;
      case "cmp_adm":
        this.displayedColumns = [
          "name",
          "department",
          "staff_level",
          // "company_share_per_txn",
          "total_sum",
          "no_of_days",
          "company_share",
          "staff_share",
        ];
        this.isComp = true;
        break;
      case "cmp_act":
        this.displayedColumns = [
          "name",
          "department",
          "staff_level",
          // "company_share_per_txn",
          "total_sum",
          "no_of_days",
          "company_share",
          "staff_share",
        ];
        this.isAcct = true;
        break;
      case "sid":
        this.isSid = true;
        this.displayedColumns = [
          "name",
          "department",
          "staff_level",
          // "company_share_per_txn",
          "total_sum",
          "no_of_days",
          "company_share",
          "staff_share",
        ];
        this.getCompanyArray();
        break;

      default:
        break;
    }
  }

  getCompanyArray() {
    this.userService.getCompanyList();
    this.userService.getCompanyListUpdate().subscribe((company) => {
      const comArray = company.results.map((element) => {
        return { name: element.name, id: element.id };
      });
      this.companyArray = [{ id: "", name: "All Companies" }, ...comArray];
    });
  }

  getTotalCost() {
    this.transactionService
      .getTotalCost(
        this.startDate,
        this.endDate,
        this.company,
        this.pageSize,
        this.pageIndex,
        this.searchText
      )
      .subscribe((orderHistory: TotalCostResponse) => {
        if (orderHistory.results) {
          this.length = orderHistory.count;
          this.dataSource = orderHistory.results.map((element, index) => {
            return { ...element, position: index + 1 };
          });
          this.tableLoading = false;
        } else {
          this.length = 0;
          this.dataSource = [];
          this.tableLoading = false;
        }
      });
  }

  onSearch(value: string) {
    this.searchText = value;
    this.getTotalCost();
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getTotalCost();
  }

  companyChange(value) {
    this.company = value;
    this.getTotalCost();
    this.tableLoading = true;
  }

  setStartDate(value) {
    this.startDate = this.helperService.formatDate(value.value);
  }

  setEndDate(value) {
    this.endDate = this.helperService.formatDate(value.value);
    this.getTotalCost();
    this.tableLoading = true;
  }

  onExportExcel() {
    this.downloading = !this.downloading;
    let data;
    data = this.dataSource.map((element) => {
      return {
        name: `${element.first_name} ${element.last_name}`,
        department: element.department,
        staff_level: element.staff_level,
        total_sum: element.total_sum,
        no_of_days: element.no_of_days,
        company_share: element.company_share,
        staff_share: element.staff_share,
      };
    });
    this.helperService.exportExcel(data, "transactions", this.displayedColumns);
    this.downloading = !this.downloading;
  }
}
