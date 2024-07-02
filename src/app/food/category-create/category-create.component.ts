import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FoodService } from "src/app/shared/services/food.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-category-create",
  templateUrl: "./category-create.component.html",
  styleUrls: ["./category-create.component.scss"],
})
export class CategoryCreateComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  title = "Add Category";
  categoryTypes: any[] = [];
  mode: string;
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private helperService: HelperService,
    public dialogRef: MatDialogRef<CategoryCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getCategoryTypes();
    this.checkMode();
  }

  checkMode() {
    if (this.data) {
      this.mode = "edit";
      this.title = "edit category";
      this.form = this.fb.group({
        id: [this.data.id, Validators.required],
        name: [this.data.name, Validators.required],
        description: [this.data.description, Validators.required],
        category_type: [this.data.category_type, Validators.required],
      });
      return;
    }
    this.mode = "create";
    this.title = "create category";
    this.form = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      category_type: ["", Validators.required],
    });
  }

  getCategoryTypes() {
    this.foodService.getCategoryTypes();
    this.foodService
      .getCategoryTypesListenerUpdated()
      .subscribe((categoryTypes: any) => {
        if (categoryTypes.results) {
          this.categoryTypes = categoryTypes.results.map((element, index) => {
            return { ...element, position: index + 1 };
          });
        } else {
          this.categoryTypes = [];
        }
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
    this.isLoading = true
    this.foodService.createCategory(this.form.value).subscribe((closeModal) => {
      closeModal
        ? this.dialogRef.close()
        : this.helperService.validateAllFormFields(this.form);
    });
  }

  updateCategory() {
    this.isLoading = true
    this.foodService.editCategory(this.form.value).subscribe((closeModal) => {
      closeModal
        ? this.dialogRef.close()
        : this.helperService.validateAllFormFields(this.form);
    });
  }
}
