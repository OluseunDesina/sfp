import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Food } from 'src/app/shared/models/food.model';

@Component({
  selector: 'app-food-info',
  templateUrl: './food-info.component.html',
  styleUrls: ['./food-info.component.scss']
})
export class FoodInfoComponent implements OnInit {
  @Input("food") food: any ='an'
  // @Input("deliveryDate") food: Food;

  constructor() { }

  ngOnInit(): void {
  }


}
