import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { FoodService } from "src/app/shared/services/food.service";
import { MealTypeCreateComponent } from "../meal-type-create/meal-type-create.component";

@Component({
  selector: "app-meal-type-list",
  templateUrl: "./meal-type-list.component.html",
  styleUrls: ["./meal-type-list.component.scss"],
})
export class MealTypeListComponent implements OnInit, OnDestroy {
  downloading = false;
  dataSource: any[] = [];
  tableLoading: boolean = true;
  title = "Meal Type";
  displayedColumns: any[] = ["position", "name", "star"];
  expandedElement: any;
  length: number;
  private pageSize: number;
  private pageIndex: number;
  private vendor: string = "";
  private subb: Subscription;

  constructor(private foodService: FoodService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.tableLoading = true;
    this.getMealTypes();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subb.unsubscribe();
  }

  openCreateMealTypeDialog(data = null) {
    const dialogRef = this.dialog.open(MealTypeCreateComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getMealTypes();
    });
  }

  getMealTypes() {
    this.subb = this.foodService.getMealTypes().subscribe((mealTypes: any) => {
      this.dataSource = mealTypes.map((element, index) => {
        return { position: index + 1, ...element };
      });
      this.tableLoading = false;
      // this.dataSource = new MatTableDataSource(orderHistory);
      // this.dataSource.sort = this.sort;
    });
  }
}
