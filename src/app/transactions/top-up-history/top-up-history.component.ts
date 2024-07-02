import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "src/app/user/user.service";
import { OrderResponse } from "../order";
import { TransactionService } from "../transaction.service";

@Component({
  selector: "app-top-up-history",
  templateUrl: "./top-up-history.component.html",
  styleUrls: ["./top-up-history.component.scss"],
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
export class TopUpHistoryComponent implements OnInit {
  dataSource: any[] = [];
  tableLoading: boolean = true;
  title = "Topup History";
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
    this.getTopUpHistory();
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "emp":
        this.isStaff = true;
        this.displayedColumns = [
          "user",
          "amount",
          "updated_status",
          "reference_no",
          "company",
          "date",
        ];
        break;
      case "ven":
        this.isVend = true;
        this.displayedColumns = [
          "user",
          "amount",
          "updated_status",
          "reference_no",
          "company",
          "date",
        ];
        break;
      case "cmp_adm":
        this.displayedColumns = [
          "user",
          "amount",
          "updated_status",
          "reference_no",
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
          "reference_no",
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
          "reference_no",
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

  getTopUpHistory() {
    this.transactionService
      .getTopUpHistory(
        this.startDate,
        this.endDate,
        this.company,
        this.pageSize,
        this.pageIndex
      )
      .subscribe((orderHistory: any[]) => {
        if (orderHistory.length > 0) {
          // this.length = orderHistory.count;
          this.dataSource = orderHistory;
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
    this.getTopUpHistory();
  }

  companyChange(value) {
    this.company = value;
    this.getTopUpHistory();
    this.tableLoading = true;
  }

  setStartDate(value) {
    this.startDate = this.helperService.formatDate(value.value);
  }

  setEndDate(value) {
    this.endDate = this.helperService.formatDate(value.value);
    this.getTopUpHistory();
    this.tableLoading = true;
  }

  onExportExcel() {
    this.downloading = !this.downloading;
    let data;
    data = this.dataSource.map((element) => {
      return {
        user: `${element.user}`,
        amount: element.amount,
        status: element.status,
        reference_no: element.reference_no,
        company: element.company,
        date: element.date_created,
      };
    });
    this.helperService.exportExcel(data, "transactions", this.displayedColumns);
    this.downloading = !this.downloading;
  }
}
