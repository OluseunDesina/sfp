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
import { FoodService } from "src/app/shared/services/food.service";
import { CategoryTypeCreateComponent } from "../category-type-create/category-type-create.component";

@Component({
  selector: "app-category-type-list",
  templateUrl: "./category-type-list.component.html",
  styleUrls: ["./category-type-list.component.scss"],
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
export class CategoryTypeListComponent implements OnInit {
  downloading = false;
  dataSource: any[] = [];
  tableLoading: boolean = true;
  title = "Category";
  displayedColumns: any[] = [
    "position",
    "name",
    // "star",
  ];
  expandedElement: any;
  length: number;
  private pageSize: number;
  private pageIndex: number;
  private vendor: string = "";

  constructor(private foodService: FoodService, private dialog: MatDialog) {}
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.tableLoading = true;
    this.getCategorys();
  }

  openCreateCategoryTypeDialog(data = null) {
    const dialogRef = this.dialog.open(CategoryTypeCreateComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCategorys();
    });
  }

  getCategorys() {
    this.foodService.getCategoryTypes(this.pageSize, this.pageIndex);
    this.foodService
      .getCategoryTypesListenerUpdated()
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
    this.getCategorys();
    this.tableLoading = true;
  }
}
