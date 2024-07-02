import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { DialogService } from "src/app/shared/services/dialog.service";
import { FoodService } from "src/app/shared/services/food.service";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-current-inventory",
  templateUrl: "./current-inventory.component.html",
  styleUrls: ["./current-inventory.component.scss"],
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
export class CurrentInventoryComponent implements OnInit, OnChanges {
  @Input("isVen") isVen;
  @Input("deliveryDate") deliveryDate;
  @Input("vendor") vendor;
  @Input("mealTypes") mealTypes: any[];
  @Output("updateInventory") updateInventory = new EventEmitter<any>();

  tableLoading: boolean;
  dataSource: any[];
  displayedColumns: any[] = [
    // "position",
    "food",
    "price",
    "quantity_left",
    "star",
  ];
  length: number;
  private pageSize: number;
  private pageIndex: number;
  isLoading: any;

  constructor(
    private foodService: FoodService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // this.getInventory()
    this.isVen
      ? (this.displayedColumns = ["food", "price", "quantity_left", "star"])
      : (this.displayedColumns = [
          "food",
          "price",
          "quantity_left",
          "vendor",
          "star",
        ]);
    this.foodService.getIsToppingUp().subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.getInventory();
  }

  test() {}

  getInventory() {
    this.tableLoading = true;
    this.foodService.getInventory(
      this.vendor,
      this.deliveryDate,
      this.pageSize,
      this.pageIndex
    );
    this.foodService
      .getInventoryListenerUpdated()
      .subscribe((inventory: any) => {
        if (inventory.results) {
          this.length = inventory.count;
          this.dataSource = inventory.results.map((element, index) => {
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
    this.getInventory();
    this.tableLoading = true;
  }

  onUpdateInventory(element) {
    if (element.meal_type) {
      this.updateInventory.emit(element);
    } else {
      this.notificationService.warning(
        "Warning",
        "Kindly select a meal type and enter a valid quantity"
      );
    }
  }

  // onDeleteInventory(food) {
  //   this.dialogService.openConfirmDialog()
  //   .afterClosed()
  //   .subscribe((value) => {
  //     if (value) {
  //       this.foodService.deleteInventory(food)
  //     }
  //   })
  // }
}
