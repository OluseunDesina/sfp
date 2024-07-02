import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { Food } from "../models/food.model";
import { PaginatedResponse } from "../models/response.model";
import { Vendor } from "../models/vendor.model";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class FoodService {
  private apiUrl = environment.url;
  private categories;
  private categoriesListener = new Subject<PaginatedResponse>();
  private categoryTypes: PaginatedResponse = new PaginatedResponse();
  private categoryTypesListener = new Subject<PaginatedResponse>();
  private inventoryTopup: PaginatedResponse = new PaginatedResponse();
  private inventoryTopupListener = new Subject<PaginatedResponse>();
  private inventory: PaginatedResponse = new PaginatedResponse();
  private inventoryListener = new Subject<PaginatedResponse>();
  private ratings: PaginatedResponse = new PaginatedResponse();
  private ratingsListener = new Subject<PaginatedResponse>();
  private foods: PaginatedResponse = new PaginatedResponse();
  private foodsListener = new Subject<PaginatedResponse>();
  private otherFoods: PaginatedResponse = new PaginatedResponse();
  private otherFoodsListener = new Subject<PaginatedResponse>();
  private isToppingUpListener = new Subject<boolean>();
  private foodCreateListener = new Subject<boolean>();
  private imageUpdateListener = new Subject<boolean>();
  private recomended: { inventory: Food[]; vendors: Vendor[]; };
  private recomendedListener = new Subject<{
    inventory: any[];
    vendors: Vendor[];
  }>();
  private mealTypes: any[];
  private mealTypesListener = new Subject<any[]>();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  createFood(food) {
    this.http.post(`${this.apiUrl}food/foods/`, food).subscribe(
      (response) => {
        this.notificationService.info(`Success`, `Food created`);
        this.foodCreateListener.next(true);
      },
      (err) => {
        this.foodCreateListener.next(false);
        this.notificationService.warning(`Error`, `Food not created`);
      }
    );
    return this.foodCreateListener.asObservable();
  }

  editFood(food) {
    this.http.patch(`${this.apiUrl}food/foods/${food.id}/`, food).subscribe(
      (response) => {
        this.notificationService.info(`Success`, `Food edited`);
        this.foodCreateListener.next(true);
      },
      (err) => {
        this.notificationService.warning(`Error`, `Food not edited`);
        this.foodCreateListener.next(false);
      }
    );
    return this.foodCreateListener.asObservable();
  }

  editFoodImage(image, food) {
    this.http.patch(`${this.apiUrl}food/foods/${food.id}/`, image).subscribe(
      (response) => {
        this.notificationService.info(`Success`, `Image Saved`);
        this.imageUpdateListener.next(true);
      },
      (err) => {
        this.notificationService.warning(`Error`, `Image corrupted`);
        this.imageUpdateListener.next(false);
      }
    );
    return this.imageUpdateListener.asObservable();
  }

  deleteFood(food) {
    this.http.delete(`${this.apiUrl}food/foods/${food.id}/`).subscribe(
      (response) => {
        this.notificationService.danger("Delete", "Your food has been deleted");
        this.foodCreateListener.next(true);
      },
      (err) => {
        this.notificationService.danger("Unsuccessful", "An error occured");
        this.foodCreateListener.next(false);
      }
    );
    return this.foodCreateListener.asObservable();
  }

  getFoodList(search, vendor, meal_type, pageSize = 10, pageIndex = 1) {
    // console.log("label-pageSize", pageSize);
    // console.log("label-pageIndex", pageIndex);
    console.log("label-vendor", vendor);
    const query = `?limit=${pageSize}&offset=${pageIndex}&vendor=${vendor}&search=${search}`;
    return this.http.get<PaginatedResponse>(`${this.apiUrl}auth/vendor-rating/${query}`);
  }

  getFoods(vendor, category = null, pageSize = 10, pageIndex = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}${vendor ? "&vendor=" + vendor : ""
      }${category ? "&category=" + category : ""}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}food/foods/${query}`)
      .subscribe(
        (res) => {
          this.foods = res;
          this.foodsListener.next({ ...this.foods });
        },
        (err) => { }
      );
  }

  getOtherFoods(vendor, delivery_date, pageSize = 10, pageIndex = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}${delivery_date ? "&delivery_date=" + delivery_date : ""
      }${vendor ? "&vendor=" + vendor : ""}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}food/inventory-unused${query}`)
      .subscribe(
        (res) => {
          this.otherFoods = res;
          this.otherFoodsListener.next({ ...this.otherFoods });
        },
        (err) => { }
      );

    return this.otherFoodsListener.asObservable();
  }

  getFoodListenerUpdate() {
    return this.foodsListener.asObservable();
  }

  createCategory(category) {
    this.http.post(`${this.apiUrl}food/categorys/`, category).subscribe(
      (response) => {
        this.notificationService.success("success", "Category created!!!");
        this.foodCreateListener.next(true);
      },
      (err) => {
        this.foodCreateListener.next(false);
      }
    );
    return this.foodCreateListener.asObservable();
  }

  editCategory(category) {
    this.http
      .patch(`${this.apiUrl}food/categorys/${category.id}/`, category)
      .subscribe(
        (response) => {
          this.foodCreateListener.next(true);
        },
        (err) => {
          this.foodCreateListener.next(false);
        }
      );
    return this.foodCreateListener.asObservable();
  }

  getCategorys(vendor_id, pageSize = 10, pageIndex = 1) {
    const query = `?${vendor_id ? "vendor=" + vendor_id : ""
      }&limit=${pageSize}&offset=${pageIndex}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}food/categorys/${query}`)
      .pipe(
        map((res) => {
          return res;
        }),
        shareReplay(1)
      )
      .subscribe(
        (res) => {
          this.categories = res;
          this.categoriesListener.next({ ...this.categories });
        },
        (err) => { }
      );
  }

  deleteCategory(category) {
    this.http.delete(`${this.apiUrl}food/categorys/${category.id}/`).subscribe(
      (response) => {
        this.notificationService.danger(
          "Delete",
          "Your category has been deleted"
        );
        this.foodCreateListener.next(true);
      },
      (err) => {
        this.notificationService.danger("Unsuccessful", "An error occured");
        this.foodCreateListener.next(false);
      }
    );
    return this.foodCreateListener.asObservable();
  }

  getCategorysListenerUpdated() {
    return this.categoriesListener.asObservable();
  }

  createCategoryType(category) {
    this.http.post(`${this.apiUrl}food/category-type/`, category).subscribe(
      (response) => {
        this.notificationService.success("success", "Category Type created!!!");
        this.foodCreateListener.next(true);
      },
      (err) => {
        this.foodCreateListener.next(false);
      }
    );
    return this.foodCreateListener.asObservable();
  }

  editCategoryType(category) {
    this.http
      .patch(`${this.apiUrl}food/category-type/${category.id}/`, category)
      .subscribe(
        (response) => {
          this.foodCreateListener.next(true);
        },
        (err) => {
          this.foodCreateListener.next(false);
        }
      );
    return this.foodCreateListener.asObservable();
  }

  getCategoryTypes(pageSize = 10, pageIndex = 1) {
    // const query = `?vendor=${vendor_id}`;
    const query = `?limit=${pageSize}&offset=${pageIndex}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}food/category-type/${query}`)
      .subscribe(
        (res) => {
          this.categoryTypes = res;
          this.categoryTypesListener.next({ ...this.categoryTypes });
        },
        (err) => { }
      );
  }

  getCategoryTypesListenerUpdated() {
    return this.categoryTypesListener.asObservable();
  }

  createInventoryTopUp() { }

  getInventoryTopUp(pageSize, pageIndex) {
    // const query = `?vendor=${vendor_id}`;
    const query = `?limit=${pageSize}&offset=${pageIndex}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}food/inventory-topup/${query}`)
      .subscribe(
        (res) => {
          this.inventoryTopup = res;
          this.inventoryTopupListener.next({ ...this.inventoryTopup });
        },
        (err) => { }
      );
  }

  getInventoryTopUpListenerUpdated() {
    return this.inventoryTopupListener.asObservable();
  }

  topupInventory(data) {
    this.isToppingUpListener.next(true);
    this.http.post(`${this.apiUrl}food/inventory/`, data).subscribe(
      (response) => {
        this.isToppingUpListener.next(false);
        this.notificationService.success(`Top up`, `Product Updated`);
      },
      (err) => {
        this.notificationService.danger(`Error `, `Product not Updated`);
      }
    );
  }

  getIsToppingUp() {
    return this.isToppingUpListener.asObservable();
  }

  getMealTypes() {
    this.http
      .get<{ results: any[]; }>(`${this.apiUrl}food/meal-type/`)
      .pipe(
        map((res) => {
          return res;
        }),
        shareReplay(1)
      )
      .subscribe(
        (mealTypes) => {
          this.mealTypes = mealTypes.results;
          this.mealTypesListener.next([...this.mealTypes]);
        },
        (err) => {
          this.mealTypesListener.next([]);
        }
      );
    return this.mealTypesListener.asObservable();
  }

  createMealType(mealType) {
    this.http.post(`${this.apiUrl}food/meal-type/`, mealType).subscribe(
      (response) => {
        this.notificationService.success("success", "Meal Type created!!!");
        this.foodCreateListener.next(true);
      },
      (err) => {
        this.foodCreateListener.next(false);
      }
    );
    return this.foodCreateListener.asObservable();
  }

  editMealType(mealType) {
    this.http
      .patch(`${this.apiUrl}food/meal-type/${mealType.id}/`, mealType)
      .subscribe(
        (response) => {
          this.notificationService.success("success", "Meal Type created!!!");
          this.foodCreateListener.next(true);
        },
        (err) => {
          this.foodCreateListener.next(false);
        }
      );
    return this.foodCreateListener.asObservable();
  }

  getInventory(vendor, delivery_date, pageSize = 10, pageIndex = 1) {
    const query = `?limit=${pageSize}&offset=${pageIndex}${delivery_date ? "&delivery_date=" + delivery_date : ""
      }${vendor ? "&vendor=" + vendor : ""}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}food/inventory/${query}`)
      .subscribe(
        (res) => {
          this.inventory = res;
          this.inventoryListener.next({ ...this.inventory });
        },
        (err) => { }
      );
  }

  deleteInventory(food) {
    this.http.delete(`${this.apiUrl}food/inventory/${food.id}/`).subscribe(
      (response) => {
        this.foodCreateListener.next(true);
        this.notificationService.danger(
          "Deleted",
          "Your inventory has been deleted"
        );
      },
      (err) => {
        this.foodCreateListener.next(false);
        this.notificationService.danger("Unsuccessful", "An error occured");
      }
    );
    return this.foodCreateListener.asObservable();
  }

  getFoodInventory(
    vendor,
    // category,
    delivery_date,
    meal_type,
    pageSize = 100,
    pageIndex = 1
  ) {
    // ${category ? "&category=" + category : ""}
    const query = `?limit=${pageSize}&offset=${pageIndex}${delivery_date ? "&delivery_date=" + delivery_date : ""
      }${vendor ? "&vendor=" + vendor : ""}${meal_type ? "&meal_type=" + meal_type : ""
      }`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}food/inventory/${query}`)
      .pipe(shareReplay())
      .subscribe(
        (res) => {
          this.inventory = res;
          this.inventoryListener.next({ ...this.inventory });
        },
        (err) => {
          this.inventory = new PaginatedResponse();
          this.inventory.results = [];
          this.inventoryListener.next({ ...this.inventory });
        }
      );
  }

  getInventoryListenerUpdated() {
    return this.inventoryListener.asObservable();
  }

  getFoodRating(pageSize, pageIndex) {
    // const query = `?vendor=${vendor_id}`;
    const query = `?limit=${pageSize}&offset=${pageIndex}`;
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}food/rating/${query}`)
      .subscribe(
        (res) => {
          this.ratings = res;
          this.ratingsListener.next({ ...this.ratings });
        },
        (err) => { }
      );
  }

  getFoodRatingUpdated() {
    return this.ratingsListener.asObservable();
  }

  getRecomended() {
    this.http.get(`${this.apiUrl}food/recommended-screen/`).subscribe(
      (response: any) => {
        this.recomended = response;
        this.recomendedListener.next({ ...this.recomended });
      },
      (err) => { }
    );

    return this.recomendedListener.asObservable();
  }
}
