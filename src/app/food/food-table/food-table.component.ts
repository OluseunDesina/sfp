import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { Food } from "src/app/shared/models/food.model";
import { FoodService } from "src/app/shared/services/food.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "src/app/user/user.service";
import { AddFoodComponent } from "../add-food/add-food.component";
import { DialogService } from "../../shared/services/dialog.service";
@Component({
  selector: "app-food-table",
  templateUrl: "./food-table.component.html",
  styleUrls: ["./food-table.component.scss"],
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
export class FoodTableComponent implements OnInit {
  downloading = false;
  dataSource: Food[] = [];
  tableLoading: boolean = true;
  title = "Foods";
  displayedColumns: any[] = [];
  expandedElement: any;
  length: number;
  private pageSize: number;
  private pageIndex: number;
  isStaff: boolean;
  isSid: boolean;
  isComp: boolean;
  isVend: boolean;
  vendor: any;

  constructor(
    private foodService: FoodService,
    private userService: UserService,
    private helperService: HelperService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {}
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.tableLoading = true;
    this.getuserGroup();
  }

  openDialog(food = null) {
    const dialogRef = this.dialog.open(AddFoodComponent, {
      data: food,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getFoodList();
    });
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "ven":
        this.isVend = true;
        this.vendor = this.helperService.getUserInfo().id;
        this.getFoodList();
        this.displayedColumns = [
          // "position",
          "food",
          "unit_price",
          "category",
          "star",
        ];
        // this.getCompanyArray()
        break;
        // case 'sid':
        //   this.isSid = true;
        //   this.getCompanyArray()
        //   break;
        // case 'comp':
        //   this.isComp = true;
        //   this.company = companyID
        // this.getCompanyArray()
        break;

      default:
        break;
    }
  }

  getFoodList() {
    this.foodService.getFoods(this.vendor, null, this.pageSize, this.pageIndex);
    this.foodService.getFoodListenerUpdate().subscribe((foodList) => {
      this.dataSource = foodList.results;
      this.length = foodList.count;
      this.tableLoading = false;
    });
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getFoodList();
    this.tableLoading = true;
  }

  onDelete(food) {
    this.dialogService
      .openConfirmDialog()
      .afterClosed()
      .subscribe((value) => {
        if (value === true) {
          this.foodService.deleteFood(food).subscribe((listener) => {
            this.getFoodList();
          });
        }
      });
  }
}
