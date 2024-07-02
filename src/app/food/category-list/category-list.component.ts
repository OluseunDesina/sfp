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
import { DialogService } from "src/app/shared/services/dialog.service";
import { FoodService } from "src/app/shared/services/food.service";
import { UserService } from "src/app/user/user.service";
import { CategoryCreateComponent } from "../category-create/category-create.component";

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"],
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
export class CategoryListComponent implements OnInit {
  vendorArray: any[] = [];
  downloading = false;
  dataSource: any[] = [];
  tableLoading: boolean = true;
  title = "Category";
  displayedColumns: any[] = ["position", "name", "category_type", "star"];
  expandedElement: any;
  length: number;
  private pageSize: number;
  private pageIndex: number;
  private vendor: string = "";

  constructor(
    private foodService: FoodService,
    private userService: UserService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {}
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.tableLoading = true;
    // this.getVendorArray()
    this.getCategorys();
  }

  openCreateCategoryDialog(data = null) {
    const dialogRef = this.dialog.open(CategoryCreateComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCategorys();
    });
  }

  getCategorys() {
    this.foodService.getCategorys(this.vendor, this.pageSize, this.pageIndex);
    this.foodService
      .getCategorysListenerUpdated()
      .subscribe((category: any) => {
        if (category.results) {
          this.length = category.count;
          this.dataSource = category.results.map((element, index) => {
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

  getVendorArray() {
    this.userService.getVendors();
    this.userService.getVendorsUpdate().subscribe((vendors) => {
      const vendorArray = vendors.results.map((element) => {
        return { name: element.bussiness_name, id: element.user.id };
      });
      this.vendorArray = [{ id: "", name: "All Vendors" }, ...vendorArray];
    });
  }

  pageChange(value: { pageSize: number; pageIndex: number }) {
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getCategorys();
    this.tableLoading = true;
  }

  vendorChange(value) {
    this.vendor = value;
    this.getCategorys();
    this.tableLoading = true;
  }

  onDeleteCategory(category) {
    this.dialogService
      .openConfirmDialog()
      .afterClosed()
      .subscribe((value) => {
        if (value) {
          this.foodService.deleteCategory(category).subscribe((value) => {
            value ? this.getCategorys() : null;
          });
        }
      });
  }
}
