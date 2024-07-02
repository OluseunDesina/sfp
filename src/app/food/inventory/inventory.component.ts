import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { User } from "src/app/auth/login-info";
import { FoodService } from "src/app/shared/services/food.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "src/app/user/user.service";
import { MatDialog } from "@angular/material/dialog";
import { AddFoodComponent } from "../add-food/add-food.component";

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"],
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
export class InventoryComponent implements OnInit {
  hideDownload: boolean = true;
  isLoading: boolean = false;
  vendorArray: any[];
  downloading = false;
  // range = new FormGroup({
  //   start: new FormControl(),
  //   end: new FormControl(),
  // });
  dataSource: any[] = [];
  tableLoading: boolean = true;
  // dataSource = new MatTableDataSource([]);
  title = "Inventory";
  displayedColumns: any[] = [
    // "position",
    "food",
    "price",
    "quantity_left",
    "star",
  ];
  expandedElement: any;
  length: number;

  deliveryDate: string;
  vendor: any = "";
  isStaff: boolean;
  isVen: boolean;
  foods: any[];
  isComp: boolean;
  view: string;
  mealTypes: any[];

  constructor(
    private foodService: FoodService,
    private userService: UserService,
    private helperService: HelperService,
    private dialog: MatDialog
  ) {}
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.tableLoading = true;
    this.deliveryDate = this.helperService.formatDate(new Date());
    this.getuserGroup();
    this.foodService.getIsToppingUp().subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.view = "inventory";
  }

  toggleView(view: string) {
    this.view = view;
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddFoodComponent);

    dialogRef.afterClosed().subscribe((result) => {
      // refresh the view
    });
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      // case "emp":
      //   this.isStaff = true;
      //   break;
      case "ven":
        this.isVen = true;
        const user: User = this.helperService.getUserInfo();
        this.vendor = user.id;
        this.getMealTypes();

        break;
      // case 'sid':
      //   this.isSid = true;
      //   this.getVendorArray()
      //   break;
      case "cmp_adm":
        this.isComp = true;
        // this.company = companyID
        this.getVendorArray();
        break;

      default:
        break;
    }
  }

  getVendorArray() {
    this.userService.getVendors();
    this.userService.getVendorsUpdate().subscribe((vendors) => {
      const vendorArray = vendors.results.map((element) => {
        return { name: element.bussiness_name, id: element.user.id };
      });
      this.vendorArray = [{ id: "", name: "All Vendors" }, ...vendorArray];
    });
  }

  getMealTypes() {
    this.foodService.getMealTypes().subscribe((mealTypes) => {
      this.mealTypes = mealTypes;
    });
  }

  vendorChange(value) {
    this.vendor = value;
    this.tableLoading = true;
  }

  setDeliveryDate(value) {
    this.deliveryDate = this.helperService.formatDate(value.value);
    this.tableLoading = true;
  }

  onUpdateInventory(element) {
    this.isLoading = true;
    const data = {
      food: element.food.id,
      delivery_date: this.deliveryDate,
      top_up_quantity: element.quantity_left,
      meal_type: element.meal_type,
    };
    this.foodService.topupInventory(data);
  }

  onExportExcel() {
    this.downloading = !this.downloading;
    let data;
    if (this.isStaff) {
      data = this.dataSource.map((element) => {
        return {
          name: element?.food?.name,
          quantity: element?.quantity,
          platform: element?.platform,
          vendor_user_id: element?.vendor_user_id_full?.bussiness_name,
          status: element?.status,
        };
      });
    } else if (this.isComp) {
      data = this.dataSource.map((element) => {
        return {
          user: element?.user,
          vendor_user_id: element?.vendor_user_id,
          name: element?.food,
          quantity: element?.quantity,
          platform: element?.platform,
          comment: element?.vendor_user_id_full?.bussiness_name,
          status: element?.status,
        };
      });
    } else if (this.isVen) {
      data = this.dataSource.map((element) => {
        return {
          user: element?.user,
          company: element?.company,
          name: element?.food,
          quantity: element?.quantity,
          platform: element?.platform,
          comment: element?.vendor_user_id_full?.bussiness_name,
          status: element?.status,
        };
      });
    }
    //else if(this.isSid) {
    //   data = this.dataSource.map((element) => {
    //     return {
    //       company: element?.company,
    //       user: element?.user,
    //       vendor_user_id: element?.vendor_user_id,
    //       name: element?.food,
    //       quantity: element?.quantity,
    //       platform: element?.platform,
    //       comment: element?.vendor_user_id_full?.bussiness_name,
    //       status: element?.status,
    //     };
    //   });
    // }
    this.helperService.exportExcel(data, "transactions", this.displayedColumns);
    this.downloading = !this.downloading;
  }
}
