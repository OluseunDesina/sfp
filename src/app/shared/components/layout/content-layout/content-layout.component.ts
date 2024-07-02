import { Component, OnInit, AfterViewInit, HostListener } from "@angular/core";
import { NavService } from "../../../services/nav.service";
import * as feather from "feather-icons";
import { CustomizerService } from "../../../services/customizer.service";
import { ErrorService } from "src/app/shared/services/error.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-content-layout",
  templateUrl: "./content-layout.component.html",
  styleUrls: ["./content-layout.component.scss"],
})
export class ContentLayoutComponent implements OnInit, AfterViewInit {
  private errSub: Subscription = new Subscription();
  constructor(
    public navServices: NavService,
    public customizer: CustomizerService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.errSub = this.errorService.createOnline$().subscribe((isOnline) => {
      isOnline ? null : this.router.navigate(["/no-internet"]);
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.errSub.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      feather.replace();
    });
  }

  collapseSidebar() {
    this.navServices.collapseSidebar = true;
  }
}
