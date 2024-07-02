import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Food } from "src/app/shared/models/food.model";
import { HelperService } from "src/app/shared/services/helper.service";

@Component({
  selector: "app-basket",
  templateUrl: "./basket.component.html",
  styleUrls: ["./basket.component.scss"],
})
export class BasketComponent implements OnInit {
  @Input("cart") cart;
  @Input("isLoading") isLoading;
  @Input("cartTotal") cartTotal;
  @Output("removeFromCart") removeFromCart = new EventEmitter<Food>();
  @Output("updateCart") updateCart = new EventEmitter<Food>();
  @Output("confirmOrder") confirmOrder = new EventEmitter<Food>();

  constructor(
    private helperService: HelperService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  onRemoveFromCart(food) {
    this.removeFromCart.emit(food);
  }

  onUpdateBasket(value) {
    this.updateCart.emit(value);
  }

  onConfirmOrder() {
    this.confirmOrder.emit(null);
  }

  hideCart() {
    this.helperService.showCart$.next(false);
  }
}
