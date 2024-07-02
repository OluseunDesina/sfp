import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { FoodRoutingModule } from "./food-routing.module";
import { FoodListComponent } from "./food-list/food-list.component";
import { FoodComponent } from "./food/food.component";
import { BasketComponent } from "./basket/basket.component";
import { FoodDetailsComponent } from "./food-details/food-details.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { SharedModule } from "../shared/shared.module";
import { MatButtonModule } from "@angular/material/button";
import { InventoryComponent } from "./inventory/inventory.component";
import { InventoryTopupComponent } from "./inventory-topup/inventory-topup.component";
import { CategoryTypeListComponent } from "./category-type-list/category-type-list.component";
import { CategoryListComponent } from "./category-list/category-list.component";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CategoryCreateComponent } from "./category-create/category-create.component";
import { AddFoodComponent } from "./add-food/add-food.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { OtherFoodsComponent } from "./inventory/other-foods/other-foods.component";
import { CurrentInventoryComponent } from "./inventory/current-inventory/current-inventory.component";
import { CategoryTypeCreateComponent } from "./category-type-create/category-type-create.component";
import { FoodTableComponent } from "./food-table/food-table.component";
import { FoodInfoComponent } from "./food-info/food-info.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SelectMealTypeComponent } from "./select-meal-type/select-meal-type.component";
import { MealTypeListComponent } from "./meal-type-list/meal-type-list.component";
import { MealTypeCreateComponent } from "./meal-type-create/meal-type-create.component";

@NgModule({
  declarations: [
    FoodListComponent,
    FoodComponent,
    BasketComponent,
    FoodDetailsComponent,
    InventoryComponent,
    InventoryTopupComponent,
    CategoryTypeListComponent,
    CategoryListComponent,
    CategoryCreateComponent,
    AddFoodComponent,
    OtherFoodsComponent,
    CurrentInventoryComponent,
    CategoryTypeCreateComponent,
    FoodTableComponent,
    FoodInfoComponent,
    SelectMealTypeComponent,
    MealTypeListComponent,
    MealTypeCreateComponent,
  ],
  imports: [
    CommonModule,
    FoodRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTableModule,
    SharedModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
})
export class FoodModule {}
