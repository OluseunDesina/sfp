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
import { FoodService } from "src/app/shared/services/food.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-other-foods",
  templateUrl: "./other-foods.component.html",
  styleUrls: ["./other-foods.component.scss"],
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
export class OtherFoodsComponent implements OnInit, OnChanges {
  @Input("isVen") isVen;
  @Input("deliveryDate") deliveryDate;
  @Input("vendor") vendor: number;
  @Input("mealTypes") mealTypes: any[];
  @Output("updateInventory") updateInventory = new EventEmitter<any>();
  tableLoading: boolean;
  displayedColumns: any[] = [
    // "position",
    "food",
    "price",
    "quantity_left",
    "star",
  ];
  dataSource: any[];
  length: number;

  private pageSize: number;
  private pageIndex: number;
  isLoading: boolean;

  constructor(
    private foodService: FoodService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
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
    this.getOtherFoods();
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  getOtherFoods() {
    this.tableLoading = true;
    this.foodService.getFoods(
      this.vendor,
      null,
      // this.deliveryDate,
      this.pageSize,
      this.pageIndex
    );
    this.foodService.getFoodListenerUpdate().subscribe((otherFoods) => {
      this.dataSource = otherFoods.results.map((element) => {
        return {
          food: element,
          quantity_left: 0,
          top_up_quantity: 0,
        };
      });
      this.length = otherFoods.count;
      this.tableLoading = false;
    });
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getOtherFoods();
    this.tableLoading = true;
  }

  onUpdateInventory(element) {
    if (element.meal_type && element.quantity_left) {
      this.updateInventory.emit(element);
    } else {
      this.notificationService.warning(
        "Warning",
        "Kindly select a meal type and enter a valid quantity"
      );
    }
  }
}
