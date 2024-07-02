import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FoodService } from "src/app/shared/services/food.service";
import { HelperService } from "../../shared/services/helper.service";

@Component({
  selector: "app-add-food",
  templateUrl: "./add-food.component.html",
  styleUrls: ["./add-food.component.scss"],
})
export class AddFoodComponent implements OnInit {
  imageChangedEvent: any = "";
  imagePreview: string;

  title = "add food";
  foodForm: FormGroup;
  imageForm: FormGroup;
  private numberPattern = /\d+/g;
  vendor: any;
  categoryList: any[] = [];
  mode: string;
  isLoading: boolean;
  constructor(
    public dialogRef: MatDialogRef<AddFoodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private foodService: FoodService,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.vendor = this.helperService.getUserInfo();
    this.getCategoryList();

    this.checkMode();
  }

  get image() {
    return this.imageForm.get("image");
  }

  onImagePicked(event) {
    this.imageChangedEvent = event;
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.imageForm.patchValue({ image: this.imagePreview });
      this.image.updateValueAndValidity();
      this.mode == "edit" ? this.saveImage() : null;
    };
    reader.readAsDataURL(file);

    // const file = files.item(0);
    // let reader = new FileReader();
    // reader.onload = (event: any) => {
    //   this.imagePreview = event.target.result;
    //   this.foodForm.patchValue({ image: this.imagePreview });
    //   this.image.updateValueAndValidity();
    //   // this.testImageFile = event.target.result;
    // };
    // reader.readAsDataURL(file);
  }

  checkMode() {
    if (this.data) {
      this.mode = "edit";
      this.title = "edit food";
      this.imagePreview = this.data.image;
      this.foodForm = this.fb.group({
        id: [this.data.id, Validators.required],
        name: [this.data.name, Validators.required],
        // image: [this.data.image, [Validators.required]],
        description: [this.data.description, Validators.required],
        unit_price: [
          this.data.unit_price,
          [
            Validators.required,
            Validators.pattern(this.numberPattern),
            Validators.min(0),
          ],
        ],
        category: [this.data.category, Validators.required],
      });
      this.imageForm = this.fb.group({
        image: [this.data.image, [Validators.required]],
      });
      return;
    }
    this.mode = "create";
    this.title = "create food";
    this.foodForm = this.fb.group({
      name: ["", [Validators.required]],
      // image: ["", [Validators.required]],
      description: [""],
      unit_price: [
        null,
        [
          Validators.required,
          Validators.pattern(this.numberPattern),
          Validators.min(0),
        ],
      ],
      category: [null, [Validators.required]],
    });
    this.imageForm = this.fb.group({
      image: [null, [Validators.required]],
    });
  }

  get foodName() {
    return this.foodForm.get("name");
  }

  get description() {
    return this.foodForm.get("description");
  }

  get unit_price() {
    return this.foodForm.get("unit_price");
  }

  get category() {
    return this.foodForm.get("category");
  }

  getCategoryList() {
    this.foodService.getCategorys(this.vendor.id);
    this.foodService.getCategorysListenerUpdated().subscribe((categoryList) => {
      this.categoryList = categoryList.results;
    });
  }

  onSave() {
    this.isLoading = true;
    if (this.foodForm.invalid) {
      this.helperService.validateAllFormFields(this.foodForm);
      this.isLoading = false;
      return;
    }
    if (this.data) {
      this.onUpdate();
      return;
    }

    this.onCreate();
  }

  onCreate() {
    this.foodService
      .createFood({ ...this.foodForm.value, ...this.imageForm.value })
      .subscribe((closeModal) => {
        this.isLoading = false;
        closeModal
          ? this.dialogRef.close()
          : this.helperService.validateAllFormFields(this.foodForm);
      });
  }

  onUpdate() {
    this.foodService.editFood(this.foodForm.value).subscribe((closeModal) => {
      this.isLoading = false;
      closeModal
        ? this.dialogRef.close()
        : this.helperService.validateAllFormFields(this.foodForm);
    });
  }

  saveImage() {
    this.isLoading = true;
    this.foodService
      .editFoodImage(this.imageForm.value, this.foodForm.value)
      .subscribe((closeModal) => {
        this.isLoading = false;
      });
  }
}
