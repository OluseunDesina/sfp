import { DOCUMENT } from "@angular/common";
import { Component, OnInit, Output, EventEmitter, Inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "src/app/auth/auth.service";
import { BasketComponent } from "src/app/food/basket/basket.component";
import { Food } from "../../models/food.model";
import { CartService } from "../../services/cart.service";
import { HelperService } from "../../services/helper.service";
import { NavService, Menu } from "../../services/nav.service";

var body = document.getElementsByTagName("body")[0];

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  public menuItems: Menu[];
  public items: Menu[];
  public openNav: boolean = false;
  public right_sidebar: boolean = false;
  public text: string;
  public elem;

  @Output() rightSidebarEvent = new EventEmitter<boolean>();
  userInfo: any;
  cart: Food[];

  constructor(
    @Inject(DOCUMENT) private document: any,
    public navServices: NavService,
    private authService: AuthService,
    private helperService: HelperService,
    private cartService: CartService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getUSer();
    this.elem = document.documentElement;
    this.navServices.items.subscribe((menuItems) => {
      this.items = menuItems;
    });
    this.getCart();
  }

  collapseSidebar() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }

  onLogout() {
    this.authService.logout();
  }
  getUSer() {
    this.userInfo = this.helperService.getUserInfo();
  }

  toggleFullScreen() {
    this.navServices.fullScreen = !this.navServices.fullScreen;
    if (this.navServices.fullScreen) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    } else {
      if (!this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  onToggleCart() {
    this.helperService.toggleCart();
  }

  openCartDialog() {
    this.dialog.open(BasketComponent);
  }

  getCart() {
    this.cartService.getCart().subscribe((cart) => {
      this.cart = cart.cart;
    });
  }
}
