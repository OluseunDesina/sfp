import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { FoodService } from "src/app/shared/services/food.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "src/app/user/user.service";

@Component({
  selector: "app-inventory-topup",
  templateUrl: "./inventory-topup.component.html",
  styleUrls: ["./inventory-topup.component.scss"],
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
export class InventoryTopupComponent implements OnInit {
  downloading = false;
  dataSource: any[] = [];
  tableLoading: boolean = true;
  // dataSource = new MatTableDataSource([]);
  title = "Inventory Topup";
  displayedColumns: any[] = [
    "position",
    "created_by",
    "company",
    "top_up_quantity",
    "date",
    "star",
  ];
  expandedElement: any;
  length: number;
  private pageSize: number;
  private pageIndex: number;

  constructor(
    private foodService: FoodService,
  ) {}
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.tableLoading = true;
    this.getInventoryTopup();
  }

  getInventoryTopup() {
    this.foodService.getInventoryTopUp(this.pageSize, this.pageIndex);
    this.foodService
      .getInventoryTopUpListenerUpdated()
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
      });
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getInventoryTopup();
    this.tableLoading = true;
  }
}
