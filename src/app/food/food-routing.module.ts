import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FoodListComponent } from "./food-list/food-list.component";
import { FoodDetailsComponent } from "./food-details/food-details.component";
import { InventoryComponent } from "./inventory/inventory.component";
import { InventoryTopupComponent } from "./inventory-topup/inventory-topup.component";
import { CategoryListComponent } from "./category-list/category-list.component";
import { CategoryTypeListComponent } from "./category-type-list/category-type-list.component";
import { MealTypeListComponent } from "./meal-type-list/meal-type-list.component";
import { CategoryCreateComponent } from "./category-create/category-create.component";
import { FoodTableComponent } from "./food-table/food-table.component";

const routes: Routes = [
  {
    path: "",
    component: FoodListComponent,
  },
  {
    path: "food-details",
    component: FoodDetailsComponent,
  },
  {
    path: "food-table",
    component: FoodTableComponent,
  },
  {
    path: "inventory",
    component: InventoryComponent,
  },
  {
    path: "inventory-topup",
    component: InventoryTopupComponent,
  },
  {
    path: "category",
    component: CategoryListComponent,
  },
  {
    path: "category-create",
    component: CategoryCreateComponent,
  },
  {
    path: "category-type",
    component: CategoryTypeListComponent,
  },
  {
    path: "meal-type",
    component: MealTypeListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodRoutingModule {}
