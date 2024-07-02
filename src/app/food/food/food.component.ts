import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Food } from "src/app/shared/models/food.model";

@Component({
  selector: "app-food",
  templateUrl: "./food.component.html",
  styleUrls: ["./food.component.scss"],
})
export class FoodComponent implements OnInit {
  @Input("food") food: Food;
  @Output("addToCart") addToCart = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onAddToCart(food: Food) {
    food.quantity = 1;
    this.addToCart.emit(food);
  }
}
