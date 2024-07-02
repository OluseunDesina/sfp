import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort/sort';
import { HelperService } from 'src/app/shared/services/helper.service';
import { UserService } from 'src/app/user/user.service';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-void-transactions',
  templateUrl: './void-transactions.component.html',
  styleUrls: ['./void-transactions.component.scss']
})
export class VoidTransactionsComponent implements OnInit {
  companyArray: any[] = [];
  statusArray: any[] = [
    { name: "All Transactions", code: "" },
    { name: "Pending Transactions", code: "pend" },
    { name: "Voided Transactions", code: "void" },
    { name: "Deleted Transactions", code: "del" },
    { name: "Cancelled Transactions", code: "cnl" },
    { name: "Failed Transactions", code: "failed" },
    { name: "Ins Transactions", code: "ins" },
    { name: "Not Pending Transactions", code: "not_pend" },
  ];
  downloading = false;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  dataSource: any[] = [];
  tableLoading: boolean = true;
  // dataSource = new MatTableDataSource([]);
  title = "Voided Transactions";
  displayedColumns: any[] = [
    "position",
    "user",
    "food",
    "comment",
    "quantity",
    "company",
    "vendor_user_id",
    "star",
  ];
  expandedElement: any;
  length: number;
  private pageSize: number;
  private pageIndex: number;
  private startDate: string;
  private endDate: string;
  private status: string = "";
  private company: string = "";

  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private helperService: HelperService
  ) {}
  // @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.tableLoading = true;
    this.startDate = this.endDate = this.helperService.formatDate(new Date());
    this.getVoidedTransactions();
    this.getCompanyArray();
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

  getVoidedTransactions() {
    this.transactionService
      .getVoidedTransactions(
        this.startDate,
        this.endDate,
        this.status,
        this.company,
        this.pageSize,
        this.pageIndex
      )
      .subscribe((voidedTransactions) => {
        if (voidedTransactions.results) {
          this.length = voidedTransactions.count;
          this.dataSource = voidedTransactions.results.map((element, index) => {
            return { ...element, position: index + 1 };
          });
          this.tableLoading = false;
        } else {
          this.length = 0;
          this.dataSource = [];
          this.tableLoading = false;
        }
        // this.dataSource = new MatTableDataSource(orderHistory);
        // this.dataSource.sort = this.sort;
      });
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getVoidedTransactions();
    this.tableLoading = true;
  }

  statusChange(value) {
    this.status = value;
    this.getVoidedTransactions();
    this.tableLoading = true;
  }

  companyChange(value) {
    this.company = value;
    this.getVoidedTransactions();
    this.tableLoading = true;
  }

  setStartDate(value) {
    this.startDate = this.helperService.formatDate(value.value);
  }

  setEndDate(value) {
    this.endDate = this.helperService.formatDate(value.value);
    this.getVoidedTransactions();
    this.tableLoading = true;
  }
}
