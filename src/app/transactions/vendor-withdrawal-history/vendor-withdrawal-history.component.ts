import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "src/app/user/user.service";
import { TransactionService } from "../transaction.service";

@Component({
  selector: "app-vendor-withdrawal-history",
  templateUrl: "./vendor-withdrawal-history.component.html",
  styleUrls: ["./vendor-withdrawal-history.component.scss"],
})
export class VendorWithdrawalHistoryComponent implements OnInit {
  dataSource: any[] = [];
  tableLoading: boolean = true;
  title = "Withdrawal History";
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

  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.startDate = this.endDate = this.helperService.formatDate(new Date());
    this.getuserGroup();
    this.getVendorWithdrawalHistory();
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
        this.displayedColumns = [
          "user",
          "amount",
          "updated_status",
          "receipient",
          "reference_no",
          "transfer_code",
          "company",
          "date",
        ];
        break;
      case "cmp_adm":
        this.displayedColumns = [
          "user",
          "amount",
          "updated_status",
          "receipient",
          // "company_share_per_txn",
          "reference_no",
          "transfer_code",
          "company",
          "date",
        ];
        this.isComp = true;
        break;
      case "cmp_act":
        this.displayedColumns = [
          "user",
          "amount",
          "updated_status",
          "receipient",
          // "company_share_per_txn",
          "reference_no",
          "transfer_code",
          "company",
          "date",
        ];
        this.isAcct = true;
        break;
      case "sid":
        this.isSid = true;
        this.displayedColumns = [
          "user",
          "amount",
          "updated_status",
          "receipient",
          // "company_share_per_txn",
          "reference_no",
          "transfer_code",
          "company",
          "date",
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

  getVendorWithdrawalHistory() {
    this.transactionService
      .getVendorWithdrawalHistory(
        this.startDate,
        this.endDate
        // this.company,
        // this.pageSize,
        // this.pageIndex
      )
      .subscribe((data: any) => {
        if (data.results) {
          this.length = data.count;
          this.dataSource = data.results.map((element, index) => {
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

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getVendorWithdrawalHistory();
  }

  companyChange(value) {
    this.company = value;
    this.getVendorWithdrawalHistory();
    this.tableLoading = true;
  }

  setStartDate(value) {
    this.startDate = this.helperService.formatDate(value.value);
  }

  setEndDate(value) {
    this.endDate = this.helperService.formatDate(value.value);
    this.getVendorWithdrawalHistory();
    this.tableLoading = true;
  }

  onExportExcel() {
    this.downloading = !this.downloading;
    let data;
    data = this.dataSource.map((element) => {
      return {
        user: `${element.user}`,
        amount: element.amount,
        updated_status: element.updated_status,
        receipient: element.receipient,
        reference_no: element.reference_no,
        transfer_code: element.transfer_code,
        company: element.company,
        date: element.date_created,
      };
    });
    this.helperService.exportExcel(data, "transactions", this.displayedColumns);
    this.downloading = !this.downloading;
  }
}
