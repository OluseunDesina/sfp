import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "../../user.service";
import { EditAccountDetailsComponent } from "../edit-account-details/edit-account-details.component";
import { VendorRatingListComponent } from "../vendor-rating-list/vendor-rating-list.component";

@Component({
  selector: "app-vendor-list",
  templateUrl: "./vendor-list.component.html",
  styleUrls: ["./vendor-list.component.scss"],
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
export class VendorListComponent implements OnInit {
  downloading;
  private pageSize: number;
  private pageIndex: number;
  tableLoading: boolean = true;
  dataSource: any[] = [];
  title = "Vendors List";
  displayedColumns: any[];
  expandedElement: any;
  length: number;
  isComp: boolean;
  isSid: boolean;
  companyArray: any[];
  company: any;
  isAcct: boolean;


  constructor(
    private userService: UserService,
    private helperService: HelperService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getVendors();
    this.getuserGroup();
  }

  openEditDialog(data = null) {
    const dialogRef = this.dialog.open(EditAccountDetailsComponent, {
      data: data,
      width: "80%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCompanyList();
    });
  }

  openRatings(element) {
    this.router.navigate(["/user/vendor-rating-list", element.id, element.bussiness_name]);
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "cmp_adm":
        this.isComp = true;
        this.displayedColumns = [
          // "position",
          "vendor_name",
          "email",
          "account_info",
          "balance",
          "company_place",
          "market_place",
          "last_login",
          "any_day_scan",
          "star",
        ];
        break;
      case "cmp_act":
        this.isAcct = true;
        this.displayedColumns = [
          // "position",
          "vendor_name",
          "email",
          "account_info",
          "balance",
          "company_place",
          "market_place",
          "last_login",
          // "any_day_scan",
          "star",
        ];
        break;
      case "sid":
        this.isSid = true;
        this.displayedColumns = [
          // "position",
          "company",
          "vendor_name",
          "email",
          "account_info",
          "balance",
          "company_place",
          "market_place",
          "last_login",
          "any_day_scan",
          "star",
        ];
        this.getCompanyList();
        break;

      default:
        break;
    }
  }

  deactivateUser(user) {
    this.tableLoading = true;
    user.user.is_active = !user.user.is_active;
    this.userService.deactivateUser(user.user).subscribe(() => {
      this.getVendors();
    });
  }

  onToggleCashHold(user) {
    this.tableLoading = true;
    user.cash_hold = !user.cash_hold;
    this.userService.toggleCashHold(user).subscribe(() => {
      this.getVendors();
    });
  }

  onToggleScan(vendor) {
    this.tableLoading = true;
    vendor.is_allow_any_day_ticket_scan = !vendor.is_allow_any_day_ticket_scan;
    this.userService.toggleScan(vendor).subscribe(() => {
      this.getVendors();
    });
  }

  companyChange(value) {
    this.company = value;
    this.getVendors();
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

  getVendors() {
    this.userService.getVendors(this.pageSize, this.pageIndex, this.company);
    this.userService.getVendorsUpdate().subscribe((vendors) => {
      this.dataSource = vendors.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
      this.tableLoading = false;
      this.length = vendors.count;
    });
  }

  pageChange(value: { pageSize: number; pageIndex: number; }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getVendors();
  }
}
