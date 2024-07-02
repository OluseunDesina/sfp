import { Component, OnInit } from "@angular/core";
import { OwlOptions } from "ngx-owl-carousel-o";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss", "./carousel.css"],
  animations: [
    trigger("flyInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        style({ transform: "translateX(-100%)" }),
        animate(1000),
      ]),
      transition("* => void", [
        animate(1000, style({ transform: "translateX(100%)" })),
      ]),
    ]),
  ],
})
export class LandingComponent implements OnInit {
  ngOnInit(): void {}
}
