import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit, ViewChild } from "@angular/core";
import { TransactionService } from "../transaction.service";
import { Order, OrderResponse } from "../order";
import { FormControl, FormGroup } from "@angular/forms";
import { UserService } from "src/app/user/user.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { FoodService } from "src/app/shared/services/food.service";
import { DialogService } from "src/app/shared/services/dialog.service";
@Component({
  selector: "app-order-history",
  templateUrl: "./order-history.component.html",
  styleUrls: ["./order-history.component.scss"],
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
export class OrderHistoryComponent implements OnInit {
  companyArray: any[];
  mealTypes: any[];
  statusArray: any[] = [
    { name: "All Transactions", code: "" },
    { name: "Pending Transactions", code: "pending" },
    { name: "Voided Transactions", code: "void" },
    { name: "Delivered Transactions", code: "delivered" },
    { name: "Cancelled Transactions", code: "cancelled" },
    { name: "Failed Transactions", code: "failed" },
    { name: "Insufficient Fund", code: "insufficient" },
    { name: "Ticket Printed", code: "ticket-printed" },
    { name: "Not Pending Transactions", code: "not_pend" },
    { name: "Force Delivered Transactions", code: "force-delivered" },
  ];
  downloading = false;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  dataSource: Order[] = [];
  tableLoading: boolean = true;
  title = "Order History";
  displayedColumns: any[] = [];
  expandedElement: any;
  length: number;
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
  vendorArray: { name: any; id: any; }[];
  vendor: any;
  isVoiding: any;
  userInfo: any;
  searchPlaceHolder: string = "Search by user email, first name or last name";
  searchText: string = "";
  allowSearch: boolean = false;
  isDeliverying: boolean;
  mealType: number;

  constructor(
    private transactionService: TransactionService,
    private foodService: FoodService,
    private userService: UserService,
    private helperService: HelperService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.pageSize = 10;
    this.tableLoading = true;
    this.startDate = this.endDate = this.helperService.formatDate(new Date());
    this.transactionService.getIsLoading().subscribe((isLoading) => {
      isLoading ? null : this.getOrderHiistory();
      this.isVoiding = this.isDeliverying = isLoading;
    });
    this.getOrderHiistory();
    this.getuserGroup();
  }

  prepareForCancel(order) {
    this.userInfo = this.helperService.getUserInfo();
    const cancelling_grace_period_in_hours =
      this.userInfo.cancelling_grace_period_in_hours;
    const delievery_date = new Date(order.delivery_date);
    const now = new Date();
    // const cancel_date: Date = delievery_date.setHours(delievery_date.getHours() - cancelling_grace_period_in_hours)
    return now > delievery_date;
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "emp":
        this.isStaff = true;
        this.displayedColumns = [
          // "position",
          "id",
          "food",
          "quantity",
          "platform",
          "vendor_user_id",
          "meal_type",
          "status",
          "star",
        ];
        this.getMealTypes();
        break;
      case "ven":
        this.isVend = true;
        this.allowSearch = true;
        this.displayedColumns = [
          // "position",
          "id",
          "user",
          "company",
          "food",
          "quantity",
          "platform",
          "comment",
          "meal_type",
          "status",
          "star",
        ];
        this.getMealTypes();
        break;
      case "cmp_adm":
        this.displayedColumns = [
          // "position",
          "id",
          "user",
          "vendor",
          "food",
          "quantity",
          "platform",
          "comment",
          "meal_type",
          "status",
          "star",
        ];
        this.isComp = true;
        this.allowSearch = true;
        this.getVendorArray();
        this.getMealTypes();
        break;
      case "cmp_act":
        this.displayedColumns = [
          // "position",
          "id",
          "user",
          "vendor",
          "food",
          "quantity",
          "platform",
          "comment",
          "meal_type",
          "status",
          "service_fee",
          "star",
        ];
        this.isAcct = true;
        this.allowSearch = true;
        this.getVendorArray();
        break;
      case "sid":
        this.isSid = true;
        this.allowSearch = true;
        this.displayedColumns = [
          "id",
          "company",
          "user",
          "vendor",
          "food",
          "quantity",
          "platform",
          "comment",
          "meal_type",
          "status",
          "service_fee",
          "star",
        ];
        this.getCompanyArray();
        this.getVendorArray();
        this.getMealTypes();
        break;

      default:
        break;
    }
  }

  getVendorArray() {
    this.userService.getVendors();
    this.userService.getVendorsUpdate().subscribe((vendors) => {
      const venArray = vendors.results.map((element) => {
        return { name: element.bussiness_name, id: element.user.id };
      });
      this.vendorArray = [{ id: "", name: "All Vendors" }, ...venArray];
    });
  }

  getMealTypes() {
    this.foodService.getMealTypes().subscribe((mealTypes) => {
      const mealTypeArray = mealTypes.map((element) => {
        return { name: element.name, id: element.id };
      });
      this.mealTypes = [{ id: "", name: "All" }, ...mealTypeArray];
    });
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

  getOrderHiistory() {
    this.transactionService
      .getOrderHistory(
        this.startDate,
        this.endDate,
        this.status,
        this.company,
        this.vendor,
        this.mealType,
        this.pageSize,
        this.pageIndex,
        this.searchText
      )
      .subscribe((orderHistory: OrderResponse) => {
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
        // this.dataSource = new MatTableDataSource(orderHistory);
        // this.dataSource.sort = this.sort;
      });
  }

  pageChange(value: { pageSize: number; pageIndex: number; }) {
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getOrderHiistory();
    this.tableLoading = true;
  }

  onSearch(value) {
    this.searchText = value;
    this.getOrderHiistory();
  }

  onExportExcel() {
    this.downloading = !this.downloading;
    let data, tableHeaders: any[];
    tableHeaders = this.displayedColumns;
    this.transactionService.downloadOrderHistory(
      this.startDate,
      this.endDate,
      this.status,
      this.company,
      this.vendor,
      this.mealType,
      this.length,
      this.pageIndex,
      this.searchText
    )
      .subscribe((response: any) => {
        if (this.isStaff) {
          data = response.results.map((element) => {
            return {
              ticket_number: element?.id,
              name: element?.food?.name,
              quantity: element?.quantity,
              platform: element?.platform,
              vendor_user_id: element?.vendor_user_id_full?.bussiness_name,
              meal_type: element?.meal_type,
              status: element?.status,
            };
          });
        } else if (this.isComp) {
          data = response.results.map((element) => {
            return {
              ticket_number: element?.id,
              user: element?.user,
              vendor_user_id: element?.vendor_user_id,
              name: element?.food,
              quantity: element?.quantity,
              platform: element?.platform,
              comment: element?.vendor_user_id_full?.bussiness_name,
              meal_type: element?.meal_type,
              status: element?.status,
              delivery_date: element?.delivery_date,
              unit_price: element?.unit_price,
            };
          });
          tableHeaders = [...this.displayedColumns, "unit price"];
        } else if (this.isVend) {
          data = response.results.map((element) => {
            return {
              ticket_number: element?.id,
              user: element?.user,
              company: element?.company,
              name: element?.food,
              quantity: element?.quantity,
              platform: element?.platform,
              comment: element?.vendor_user_id_full?.bussiness_name,
              meal_type: element?.meal_type,
              status: element?.status,
              delivery_date: element?.delivery_date,
            };
          });
        } else if (this.isAcct) {
          data = response.results.map((element) => {
            return {
              ticket_number: element?.id,
              // company: element?.company,
              user: element?.user,
              vendor_user_id: element?.vendor_user_id,
              name: element?.food,
              quantity: element?.quantity,
              platform: element?.platform,
              comment: element?.vendor_user_id_full?.bussiness_name,
              meal_type: element?.meal_type,
              status: element?.status,
              service_fee: element?.service_fee,
              delivery_date: element?.delivery_date,
            };
          });
        } else if (this.isSid) {
          data = response.results.map((element) => {
            return {
              ticket_number: element?.id,
              company: element?.company,
              user: element?.user,
              vendor_user_id: element?.vendor_user_id,
              name: element?.food,
              quantity: element?.quantity,
              platform: element?.platform,
              comment: element?.vendor_user_id_full?.bussiness_name,
              meal_type: element?.meal_type,
              status: element?.status,
              service_fee: element?.service_fee,
              delivery_date: element?.delivery_date,
            };
          });
        }
        this.helperService.exportExcel(data, "transactions", tableHeaders);
        this.downloading = !this.downloading;
      });

  }

  onTakeSurvey(txn) {
    // console.log(txn)
    this.dialogService.surveyDialog(txn);
  }

  statusChange(value) {
    this.status = value;
    this.getOrderHiistory();
    this.tableLoading = true;
  }

  companyChange(value) {
    this.company = value;
    this.getOrderHiistory();
    this.tableLoading = true;
  }

  onMealTypeChange(value) {
    this.mealType = value;
    this.getOrderHiistory();
    this.tableLoading = true;
  }

  setStartDate(value) {
    this.startDate = this.helperService.formatDate(value.value);
  }

  setEndDate(value) {
    this.endDate = this.helperService.formatDate(value.value);
    this.getOrderHiistory();
    this.tableLoading = true;
  }

  vendorChange(value) {
    this.vendor = value;
    this.getOrderHiistory();
    this.tableLoading = true;
  }

  onVoidTransaction(transactionId) {
    this.isVoiding = true;
    this.transactionService.void(transactionId).subscribe((isLoading) => {
      this.isVoiding = isLoading;
      isLoading ? this.getOrderHiistory() : null;
    });
  }

  onDeliver(receipt_id) {
    this.isDeliverying = true;
    this.transactionService.adminDeliver(receipt_id).subscribe((isLoading) => {
      this.isDeliverying = isLoading;
      isLoading ? this.getOrderHiistory() : null;
    });
  }

  onCancelOrder(food) {
    this.transactionService.cancelOrder(food);
  }
}
