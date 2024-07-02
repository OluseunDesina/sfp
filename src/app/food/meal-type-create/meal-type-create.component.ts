import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FoodService } from "src/app/shared/services/food.service";
import { HelperService } from "src/app/shared/services/helper.service";

@Component({
  selector: "app-meal-type-create",
  templateUrl: "./meal-type-create.component.html",
  styleUrls: ["./meal-type-create.component.scss"],
})
export class MealTypeCreateComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  title = "Add Category";
  mode: string;
  isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private helperService: HelperService,
    public dialogRef: MatDialogRef<MealTypeCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.checkMode();
  }

  checkMode() {
    if (this.data) {
      this.mode = "edit";
      this.title = "edit Meal type";
      this.form = this.fb.group({
        id: [this.data.id, [Validators.required]],
        name: [this.data.name, Validators.required],
      });
      return;
    }
    this.mode = "create";
    this.title = "create Meal type";
    this.form = this.fb.group({
      id: [null, []],
      name: ["", Validators.required],
    });
  }

  onSave() {
    this.isLoading = true;
    if (this.form.invalid) {
      this.helperService.validateAllFormFields(this.form);
      this.isLoading = false;
      return;
    }

    if (this.data) {
      this.updateMealType();
      return;
    }

    this.createMealType();
  }

  createMealType() {
    this.isLoading = true;
    this.foodService.createMealType(this.form.value).subscribe((closeModal) => {
      this.isLoading = false;
      closeModal
        ? this.dialogRef.close()
        : this.helperService.validateAllFormFields(this.form);
    });
  }
  updateMealType() {
    this.isLoading = true;
    this.foodService.editMealType(this.form.value).subscribe((closeModal) => {
      this.isLoading = false;
      closeModal
        ? this.dialogRef.close()
        : this.helperService.validateAllFormFields(this.form);
    });
  }
}
