import { Component, OnInit } from "@angular/core";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { MatDialogRef } from "@angular/material/dialog";
import { FoodService } from "src/app/shared/services/food.service";

@Component({
  selector: "app-select-meal-type",
  templateUrl: "./select-meal-type.component.html",
  styleUrls: ["./select-meal-type.component.scss"],
})
export class SelectMealTypeComponent implements OnInit {
  mealTypes: any[];
  constructor(
    private foodService: FoodService,
    public dialogRef: MatDialogRef<SelectMealTypeComponent>
  ) {}

  ngOnInit(): void {
    this.getMealTypes();
  }

  getMealTypes() {
    this.foodService.getMealTypes().subscribe((mealTypes) => {
      this.mealTypes = mealTypes;
    });
  }

  onChange(event: MatButtonToggleChange) {
    this.dialogRef.close(event.value.id);
  }
}
