import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Food } from "../models/food.model";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cart: Food[] = [];
  private cartTotal: number = 0;
  private cartListener = new BehaviorSubject<{ cart: Food[]; total: number }>({
    cart: this.cart,
    total: this.cartTotal,
  });
  private dailyLimit = 200;
  private personalBalance = 200;
  private allow_mix: boolean = true;
  private cartTotalListener = new BehaviorSubject<number>(this.cartTotal);

  constructor(private notificationSetvice: NotificationService) {}

  // addToCart(food: Food) {
  //   const subPrice = food.quantity * food.unit_price;
  //   if (this.dailyLimit >= subPrice) {
  //     this.inAddToCart(food);
  //   } else if (this.allow_mix) {
  //     const allowance = this.personalBalance + this.dailyLimit;
  //     if (allowance >= subPrice) {
  //       const allow = confirm(
  //         `Amount exceed company wallet, would you like to use your personal wallet?`
  //       );
  //       if (allow) {
  //         this.inAddToCart(food);
  //       }
  //     } else {
  //       alert(
  //         `Amount exceeds company wallet, Please topup your personal wallet to continue with this transaction`
  //       );
  //     }
  //   }
  //   this.cartListener.next([...this.cart]);
  // }

  inAddToCart(food: Food) {
    // check if food is already in cart
    // const add = this.cart.some((element: Food) => {})
    const dontAdd = this.cart.some((element: Food) => {
      return element.id == food.id ? true : false;
    });
    dontAdd ? null : this.cart.push(food);
    this.cartTotal = this.calcCartTotal();
    this.cartListener.next({ cart: this.cart, total: this.cartTotal });
    this.notificationSetvice.success(
      "Added to cart",
      `${food.name} has been added to cart`
    );
  }

  // updateCart(food: Food) {
  //   let subPrice = food.quantity * food.unit_price;
  //   if (this.dailyLimit >= subPrice) {
  //     this.onUpdateCart(food);
  //   } else if (this.allow_mix) {
  //     const allowance = this.personalBalance + this.dailyLimit;
  //     if (allowance >= subPrice) {
  //       const allow = confirm(
  //         `Amount exceed company wallet, would you like to use your personal wallet?`
  //       );
  //       if (allow) {
  //         this.onUpdateCart(food);
  //       }
  //     } else {
  //       alert(
  //         `Amount exceeds company wallet, Please topup your personal wallet to continue with this transaction`
  //       );
  //       food.quantity = 1;
  //       this.cart.push(food);
  //     }
  //   }
  //   this.cartListener.next([...this.cart]);
  // }

  onUpdateCart(food: Food) {
    const updatedCart = [...this.cart];
    const oldFoodIndex = updatedCart.findIndex(
      (element) => element.id === food.id
    );
    updatedCart[oldFoodIndex] = food;
    this.cart = updatedCart;
    this.cartTotal = this.calcCartTotal();
    this.cartListener.next({ cart: this.cart, total: this.cartTotal });
  }

  removeFromCart(food: Food) {
    // const item = this.cart.find((element) => element.id === food.id)
    const newCart = this.cart.filter((element) => {
      if (element.id !== food.id) {
        return element;
      }
    });
    this.cart = newCart;
    this.cartTotal = this.calcCartTotal();
    this.cartListener.next({ cart: this.cart, total: this.cartTotal });
  }

  clearCart() {
    this.cart = [];
    this.cartTotal = 0;
    this.cartListener.next({ cart: this.cart, total: this.cartTotal });
  }

  getCart() {
    return this.cartListener.asObservable();
  }

  calcCartTotal(): number {
    let totalArray = this.cart.length
      ? this.cart.map((element) => element.unit_price * element.quantity)
      : [];
    const reducer: any = (a, b) => {
      return a + b;
    };
    return this.cart.length ? totalArray.reduce(reducer) : null;
  }
}
