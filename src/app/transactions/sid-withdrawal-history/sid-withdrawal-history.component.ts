import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Subscription } from "rxjs";
import { PaginatedResponse } from "src/app/shared/models/response.model";
import { HelperService } from "src/app/shared/services/helper.service";
import { TransactionService } from "../transaction.service";

@Component({
  selector: "app-sid-withdrawal-history",
  templateUrl: "./sid-withdrawal-history.component.html",
  styleUrls: ["./sid-withdrawal-history.component.scss"],
})
export class SidWithdrawalHistoryComponent implements OnInit {
  // dataSource: any[] = ;
  tableLoading: boolean = true;
  dataSource: any[] = [];
  title = "SID Withdrawal History";

  displayedColumns: any[] = [];
  subb: Subscription;

  expandedElement: any;
  length: number;
  downloading: boolean = false;
  private pageSize: number;
  private pageIndex: number;
  private startDate: string;
  private endDate: string;

  constructor(
    private transactionService: TransactionService,
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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subb.unsubscribe();
  }

  getWithdrawalHiistory() {
    this.subb = this.transactionService
      .getSidWithdrawalHistory(this.startDate, this.endDate)
      .subscribe((withdrawal: PaginatedResponse) => {
        this.length = withdrawal.count;
        this.dataSource = withdrawal.results;
        this.tableLoading = false;
      });
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getWithdrawalHiistory();
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
