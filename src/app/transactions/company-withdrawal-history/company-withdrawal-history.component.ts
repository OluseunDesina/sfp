import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "src/app/user/user.service";
import { TransactionService } from "../transaction.service";

@Component({
  selector: "app-company-withdrawal-history",
  templateUrl: "./company-withdrawal-history.component.html",
  styleUrls: ["./company-withdrawal-history.component.scss"],
})
export class CompanyWithdrawalHistoryComponent implements OnInit {
  // dataSource: any[] = ;
  downloading;
  private pageSize: number;
  private pageIndex: number;
  tableLoading: boolean = true;
  dataSource: any[] = [];
  title = "Company Withdrawal History";
  displayedColumns: any[] = [];
  expandedElement: any;
  length: number;
  startDate: string;
  endDate: string;
  companyArray: { name: any; id: any }[] = [];
  company: any;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private helperService: HelperService
  ) {}
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
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
    this.startDate = this.endDate = this.helperService.formatDate(new Date());
    this.getWithdrawalHiistory();
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

  getWithdrawalHiistory() {
    this.transactionService
      .getCompanyWithdrawalHistory(this.startDate, this.endDate)
      .subscribe((companyWithdrawal) => {
        this.length = companyWithdrawal.length;
        this.dataSource = companyWithdrawal;
        this.tableLoading = false;
      });
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getWithdrawalHiistory();
  }

  companyChange(value) {
    this.company = value;
    this.getWithdrawalHiistory();
    this.tableLoading = true;
  }

  setStartDate(value) {
    this.startDate = this.helperService.formatDate(value.value);
  }

  setEndDate(value) {
    this.endDate = this.helperService.formatDate(value.value);
    this.getWithdrawalHiistory();
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
