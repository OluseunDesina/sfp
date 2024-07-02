import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FoodService } from "src/app/shared/services/food.service";
import { HelperService } from "src/app/shared/services/helper.service";

@Component({
  selector: "app-category-type-create",
  templateUrl: "./category-type-create.component.html",
  styleUrls: ["./category-type-create.component.scss"],
})
export class CategoryTypeCreateComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  title = "Add Category";
  mode: string;
  isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private helperService: HelperService,
    public dialogRef: MatDialogRef<CategoryTypeCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.checkMode();
  }

  checkMode() {
    if (this.data) {
      this.mode = "edit";
      this.title = "edit category type";
      this.form = this.fb.group({
        id: [this.data.id, [Validators.required]],
        name: [this.data.name, Validators.required],
      });
      return;
    }
    this.mode = "create";
    this.title = "create category type";
    this.form = this.fb.group({
      id: [null, []],
      name: ["", Validators.required],
    });
  }

  onSave() {
    if (this.form.invalid) {
      this.helperService.validateAllFormFields(this.form);
      return;
    }

    if (this.data) {
      this.updateCategory();
      return;
    }

    this.createCategory();
  }

  createCategory() {
    this.isLoading = true;
    this.foodService
      .createCategoryType(this.form.value)
      .subscribe((closeModal) => {
        closeModal
          ? this.dialogRef.close()
          : this.helperService.validateAllFormFields(this.form);
      });
  }
  updateCategory() {
    this.isLoading = true;
    this.foodService
      .editCategoryType(this.form.value)
      .subscribe((closeModal) => {
        closeModal
          ? this.dialogRef.close()
          : this.helperService.validateAllFormFields(this.form);
      });
  }
}
