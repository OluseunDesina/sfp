import { Component, OnInit } from "@angular/core";
import { FoodService } from "../../shared/services/food.service";
import { VendorService } from "../../shared/services/vendor.service";
import { Vendor } from "../../shared/models/vendor.model";
import { Category, Food } from "../../shared/models/food.model";
import { CartService } from "src/app/shared/services/cart.service";
import { TransactionService } from "src/app/transactions/transaction.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { Router } from "@angular/router";
import { take } from "rxjs/operators";

@Component({
  selector: "app-food-list",
  templateUrl: "./food-list.component.html",
  styleUrls: ["./food-list.component.scss"],
})
export class FoodListComponent implements OnInit {
  vendors: Vendor[] = [];
  selectedVendor: Vendor;
  categories: Category[] = [];
  selectedCategory: Category;
  foodList: Food[] = [];
  cart: Food[] = [];
  recomendedFoods: Food[];
  dailyLimit = 0;
  personalBalance = 0;
  allow_mix: boolean = true;
  delivery_date: any;
  isLoading: boolean = false;

  dateFilter = (d: Date | null): boolean => {
    let start_date: Date, end_date: Date, today: Date;
    let allow = this.user.allow_same_day_booking;
    start_date = new Date(this.user.start_booking_date);
    start_date.setHours(0, 0, 0, 0);
    end_date = new Date(this.user.end_booking_date);
    today = new Date();
    today.setHours(0, 0, 0, 0);
    return allow
      ? start_date <= d && d >= today && d <= end_date
      : start_date <= d && d > today && d <= end_date;
  };
  cartTotal: number;
  isStaff: boolean;
  isVend: boolean;
  user: any;
  foodLoading: boolean = true;
  selectedmealType: string;
  mealTypes: any[] = [];
  showCart: boolean = false;
  mobile: boolean;

  constructor(
    private foodService: FoodService,
    private vendorService: VendorService,
    private cartService: CartService,
    private transactionService: TransactionService,
    private helperService: HelperService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.helperService.getUserInfo();
    this.transactionService.getIsLoading().subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.getuserGroup();
    this.getMealTypes();
    this.foodService.getRecomended().subscribe((recomended) => {
      this.vendors = recomended.vendors;
      this.selectedVendor = this.vendors[0];
      this.getCategories(this.selectedVendor);
      this.recomendedFoods = recomended.inventory.map((element) => {
        return {
          delivery_date: element.delivery_date,
          mealType: element.meal_type,
          ...element.food,
        };
      });
      let deliveryDate;
      let today = new Date();
      let startDate = new Date(this.user.start_booking_date);
      // recomended.inventory.length > 0
      //   ? (deliveryDate = recomended.inventory[0]?.delivery_date)
      //   : (deliveryDate = new Date());
      this.user.allow_same_day_booking
        ? (deliveryDate = today)
        : (deliveryDate = new Date(today.setDate(today.getDate() + 1)));

      deliveryDate < startDate ? (deliveryDate = startDate) : null;

      this.setDeliveryDate(deliveryDate);
    });
    this.getCart();
    this.getShowCart();
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "emp":
        this.isStaff = true;
        break;
      case "ven":
        this.isVend = true;
        break;
      // case 'sid':
      //   this.isSid = true;
      //   this.getCompanyArray()
      //   break;
      // case 'comp':
      //   this.isComp = true;
      //   this.company = companyID
      // this.getCompanyArray()
      // break;

      default:
        break;
    }
  }

  setDeliveryDate(value) {
    this.foodLoading = true;
    this.delivery_date = this.helperService.formatDate(value);
    this.getDailyLimit();
    this.getFoods();
  }

  getDailyLimit() {
    this.transactionService
      .getDailyLimit(this.delivery_date)
      .subscribe((dailyLimit) => {
        this.dailyLimit = dailyLimit;
      });
  }

  // getVendors() {
  //   this.vendorService.getVendors();
  //   this.vendorService.getVendorsListener().subscribe((vendors) => {
  //     this.vendors = vendors.results;
  //     this.selectedVendor = this.vendors[0];
  //     this.getCategories(this.selectedVendor);
  //   });
  // }

  addToCart(food: Food) {
    food.meal_type = this.selectedmealType;
    const subPrice = food.quantity * food.unit_price;
    if (this.dailyLimit >= subPrice) {
      this.cartService.inAddToCart(food);
      // this.inAddToCart(food);
    } else if (this.allow_mix) {
      const allowance = this.personalBalance + this.dailyLimit;
      if (allowance >= subPrice) {
        const allow = confirm(
          `Amount exceed company wallet, would you like to use your personal wallet?`
        );
        if (allow) {
          this.cartService.inAddToCart(food);
          // this.inAddToCart(food);
        }
      } else {
        alert(
          `Amount exceeds company wallet, Please topup your personal wallet to continue with this transaction`
        );
        this.router.navigate(["/transactions/topup-personal"]);
      }
    }
    // this.cartListener.next([...this.cart]);
  }

  getMealTypes() {
    this.foodService.getMealTypes().subscribe((mealTypes) => {
      this.mealTypes = mealTypes;
      this.selectedmealType = mealTypes[0].id;
    });
  }

  getCategories(vendor) {
    this.foodLoading = true;
    this.selectedVendor = vendor;
    this.foodService.getCategorys(this.selectedVendor.user.id);
    this.foodService
      .getCategorysListenerUpdated()
      .pipe(take(1))
      .subscribe((categorries) => {
        this.categories = categorries.results;
        this.selectedCategory = this.categories[0];
        if (this.selectedCategory) {
          this.getFoods();
        } else {
          this.foodLoading = false;
          this.foodList = [];
        }
      });
  }

  getFoods() {
    if (this.selectedmealType && this.selectedVendor && this.delivery_date) {
      this.foodService.getFoodInventory(
        this.selectedVendor.user.id,
        this.delivery_date,
        this.selectedmealType
      );
      this.foodService.getInventoryListenerUpdated().subscribe((foods) => {
        this.foodLoading = false;
        if (foods?.results) {
          this.foodList = foods.results.map((element) => {
            return {
              delivery_date: element.delivery_date,
              ...element.food,
            };
          });
        } else {
          this.foodList = [];
        }
      });
    } else {
      this.foodLoading = false;
      this.foodList = [];
      return;
    }
  }

  getCart() {
    this.cartService.getCart().subscribe((cart) => {
      this.cart = cart.cart;
      this.cartTotal = cart.total;
      // this.cartService.calcCartTotal();
    });
  }

  onRemoveFromCart(value: Food) {
    this.cartService.removeFromCart(value);
  }

  onUpdateBasket(food: Food) {
    let subPrice = food.quantity * food.unit_price;
    if (this.dailyLimit >= subPrice) {
      this.cartService.onUpdateCart(food);
      // this.onUpdateCart(food);
    } else if (this.allow_mix) {
      const allowance = this.personalBalance + this.dailyLimit;
      if (allowance >= subPrice) {
        const allow = confirm(
          `Amount exceed company wallet, would you like to use your personal wallet?`
        );
        if (allow) {
          this.cartService.onUpdateCart(food);
          // this.onUpdateCart(food);
        }
      } else {
        alert(
          `Amount exceeds company wallet, Please topup your personal wallet to continue with this transaction`
        );
        // navigate them to top up screen;
        food.quantity = 1;
        this.cartService.inAddToCart(food);
        this.router.navigate(["/transactions/topup-personal"]);
      }
    }
  }

  onConfirmOrder() {
    this.transactionService.placeOrder(this.cart);
  }

  formatDate(date) {
    const newDate = new Date(date);
    return this.helperService.formatDate(newDate);
  }

  getShowCart() {
    this.helperService.showCart$.subscribe((showCart) => {
      this.showCart = showCart;
    });
  }
}
