import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-star-component',
  templateUrl: './star-component.component.html',
  styleUrls: ['./star-component.component.scss']
})
export class StarComponentComponent implements OnInit {
  @Input() maxRating = 5;
  maxRatingArr: any = [];

  @Output()
  onRating: EventEmitter<number> = new EventEmitter<number>()

  @Input() SelectedStar: number = 0;
  previousSelection = 0;

  constructor() { }

  ngOnInit(): void {
    this.maxRatingArr = Array(this.maxRating).fill(0)
  }

  handleMouseEnter(index: number) {
    this.SelectedStar = index + 1;
  }

  handleMouseLeave() {
    if (this.previousSelection !== 0) {
      this.SelectedStar = this.previousSelection
    } else {
      this.SelectedStar = 0;
    }
  }

  Rating(index: number) {
    this.SelectedStar = index + 1;
    this.previousSelection = this.SelectedStar;
    this.onRating.emit(this.SelectedStar)
  }
}
