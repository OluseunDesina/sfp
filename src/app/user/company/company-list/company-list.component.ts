import { Component, OnInit } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { UserService } from "../../user.service";
import { Company } from "../../company";
import { TransactionService } from "src/app/transactions/transaction.service";

@Component({
  selector: "app-company-list",
  templateUrl: "./company-list.component.html",
  styleUrls: ["./company-list.component.scss"],
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
export class CompanyListComponent implements OnInit {
  private pageSize: number;
  private pageIndex: number;
  length: number;
  tableLoading: boolean = true;
  companyList: Company[] = [];
  displayedColumns: any[] = [
    "position",
    "company_name",
    "contact_name",
    "contact_email",
    "actual_balance",
    "sid_balance",
    "wthdrawal",
    "star",
  ];
  expandedElement: any;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getCompanyList();
  }

  getCompanyList() {
    this.userService.getCompanyList(this.pageSize, this.pageIndex);
    this.userService.getCompanyListUpdate().subscribe((companyList) => {
      this.companyList = companyList.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
      this.tableLoading = false;
      this.length = companyList.count;
    });
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getCompanyList();
  }

  onCashout(company) {
    this.transactionService.cashout(company.id, company.balance);
  }

  onTriggerCashouts(company) {
    this.transactionService.triggerCashouts(company.id);
  }

  onTriggerTopups(company) {
    this.transactionService.triggerTopups(company.id);
  }
}
