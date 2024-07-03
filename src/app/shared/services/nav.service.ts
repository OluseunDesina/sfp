import { Injectable, HostListener } from "@angular/core";
import { BehaviorSubject, Observable, Subscriber } from "rxjs";
import { HelperService } from "./helper.service";

// Menu
export interface Menu {
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: "root",
})
export class NavService {
  public screenWidth: any;
  public collapseSidebar: boolean = false;
  private MENUITEMS: Menu[] = [];
  public fullScreen = false;
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

  constructor(private helperService: HelperService) {
    // this.getUserGroup();
    this.onResize();
    if (this.screenWidth < 991) {
      this.collapseSidebar = true;
    }
  }

  // Windows width
  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }

  // get navigation
  getUserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "emp":
        this.MENUITEMS = [
          {
            title: "Dashboard",
            icon: "activity",
            type: "link",
            badgeType: "primary",
            active: true,
            path: "/dashboard",
          },
          {
            title: "Food",
            icon: "coffee",
            type: "link",
            badgeType: "primary",
            active: true,
            path: "/food",
          },
          {
            title: "Transactions",
            icon: "file-text",
            type: "sub",
            badgeType: "primary",
            active: true,
            children: [
              {
                path: "/transactions/order-history",
                title: "Order History",
                type: "link",
              },
              {
                path: "/transactions/topup-history",
                title: "Top Up History",
                type: "link",
              },
              {
                path: "/transactions/topup-personal",
                title: "Top Up",
                type: "link",
              },
            ],
          },
        ];
        this.items.next(this.MENUITEMS);
        break;
      case "ven":
        this.MENUITEMS = [
          {
            title: "Dashboard",
            icon: "activity",
            type: "link",
            badgeType: "primary",
            active: true,
            path: "/dashboard",
          },
          {
            title: "Food",
            icon: "coffee",
            type: "sub",
            badgeType: "primary",
            active: true,
            children: [
              {
                title: "Food",
                type: "link",
                path: "/food/food-table",
              },
              {
                title: "Inventory",
                icon: "anchor",
                badgeType: "primary",
                active: false,
                path: "/food/inventory",
                type: "link",
              },
              {
                title: "Category",
                icon: "anchor",
                badgeType: "primary",
                active: false,
                path: "/food/category",
                type: "link",
              },
            ],
          },
          {
            title: "Transactions",
            icon: "file-text",
            type: "sub",
            badgeType: "primary",
            active: true,
            children: [
              {
                path: "/transactions/order-history",
                title: "Order History",
                type: "link",
              },
              {
                path: "/transactions/vendor-withdrawal-history",
                title: "Withdrawal History",
                type: "link",
              },
            ],
          },
        ];
        this.items.next(this.MENUITEMS);
        break;
      case "cmp_adm":
        this.MENUITEMS = [
          {
            title: "Dashboard",
            icon: "activity",
            type: "link",
            badgeType: "primary",
            active: true,
            path: "/dashboard",
          },
          {
            title: "School Device Management",
            icon: "coffee",
            type: "link",
            badgeType: "primary",
            active: true,
            path: "/devices",
          },
          {
            title: "User Management",
            icon: "users",
            type: "sub",
            badgeType: "primary",
            active: true,
            children: [
              // {
              //   title: "School Admin",
              //   icon: "anchor",
              //   type: "sub",
              //   badgeType: "primary",
              //   active: false,
              //   children: [
              //     // {
              //     //   path: "/user/company-admin-create",
              //     //   title: "Add Admin",
              //     //   type: "link",
              //     // },
              //     {
              //       path: "/user/company-admin-list",
              //       title: "All Admin",
              //       type: "link",
              //     },
              //   ],
              // },
              // {
              //   title: "School Accountant",
              //   icon: "anchor",
              //   type: "sub",
              //   badgeType: "primary",
              //   active: false,
              //   children: [
              //     {
              //       path: "/user/accountant-create",
              //       title: "Add Accountant",
              //       type: "link",
              //     },
              //     {
              //       path: "/user/accountant-list",
              //       title: "All Accountants",
              //       type: "link",
              //     },
              //   ],
              // },
              {
                title: "Schools",
                icon: "anchor",
                badgeType: "primary",
                active: false,
                path: "/user/school-list",
                type: "link",
              },
              {
                title: "Students",
                icon: "anchor",
                badgeType: "primary",
                active: false,
                path: "/user/student-list",
                type: "link",
              },
              {
                title: "Caterers",
                icon: "anchor",
                badgeType: "primary",
                active: false,
                path: "/user/caterer-list",
                type: "link",
              },
              // {
              //   title: "Farmers",
              //   icon: "anchor",
              //   badgeType: "primary",
              //   active: false,
              //   path: "/user/farmer-list",
              //   type: "link",
              // },
              // {
              //   title: "Department",
              //   icon: "anchor",
              //   type: "sub",
              //   badgeType: "primary",
              //   active: false,
              //   children: [
              //     {
              //       path: "/user/department-create",
              //       title: "Add Department",
              //       type: "link",
              //     },
              //     {
              //       path: "/user/department-list",
              //       title: "All Departments",
              //       type: "link",
              //     },
              //   ],
              // },
              // {
              //   title: "Vendor",
              //   icon: "anchor",
              //   type: "sub",
              //   badgeType: "primary",
              //   active: false,
              //   children: [
              //     {
              //       path: "/user/vendor-create",
              //       title: "Add Vendor",
              //       type: "link",
              //     },
              //     {
              //       path: "/user/vendor-list",
              //       title: "All Vendors",
              //       type: "link",
              //     },
              //   ],
              // },
            ],
          },
          {
            title: "Food",
            icon: "coffee",
            type: "sub",
            badgeType: "primary",
            active: true,
            children: [
              {
                title: "Food",
                icon: "coffee",
                type: "link",
                badgeType: "primary",
                active: true,
                path: "/food",
              },
              {
                title: "Inventory",
                icon: "anchor",
                type: "sub",
                badgeType: "primary",
                active: false,
                children: [
                  {
                    path: "/food/inventory",
                    title: "Inventory List",
                    type: "link",
                  },
                  // {
                  //   path: "/food/inventory-topup",
                  //   title: "Inventory Topup",
                  //   type: "link",
                  // },
                ],
              },
              {
                title: "Category",
                icon: "anchor",
                type: "sub",
                badgeType: "primary",
                active: false,
                children: [
                  {
                    path: "/food/category-type",
                    title: "Category Type",
                    type: "link",
                  },
                ],
              },
              {
                title: "Meal Type",
                icon: "anchor",
                type: "sub",
                badgeType: "primary",
                active: false,
                children: [
                  {
                    path: "/food/meal-type",
                    title: "Meal Type",
                    type: "link",
                  },
                ],
              },
            ],
          },
          {
            title: "Transactions",
            icon: "file-text",
            type: "sub",
            badgeType: "primary",
            active: true,
            children: [
              {
                path: "/transactions/order-history",
                title: "Order History",
                type: "link",
              },
              {
                path: "/transactions/total-cost",
                title: "Total Cost",
                type: "link",
              },
              {
                path: "/transactions/topup-history",
                title: "Top Up History",
                type: "link",
              },
              {
                path: "/transactions/company-withdrawal-history",
                title: "School's Withdrawal",
                type: "link",
              },
              {
                path: "/transactions/vendor-withdrawal-history",
                title: "Vendor Withdrawal",
                type: "link",
              },
              // {
              //   path: "/transactions/voided-transactions",
              //   title: "Voided Transactions",
              //   type: "link",
              // },
            ],
          },
          {
            title: "Survey",
            icon: "edit",
            type: "sub",
            badgeType: "primary",
            active: true,
            children: [
              {
                path: "/survey/survey-list",
                title: "Survey Questions",
                type: "link",
              },
              {
                path: "/survey/survey-response-stat",
                title: "Survey Responses",
                type: "link",
              },
            ],
          },
        ];
        this.items.next(this.MENUITEMS);
        break;
      case "cmp_act":
        this.MENUITEMS = [
          {
            title: "Dashboard",
            icon: "activity",
            type: "link",
            badgeType: "primary",
            active: true,
            path: "/dashboard",
          },
          {
            title: "Transactions",
            icon: "file-text",
            type: "sub",
            badgeType: "primary",
            active: true,
            children: [
              {
                path: "/transactions/order-history",
                title: "Order History",
                type: "link",
              },
              {
                path: "/transactions/total-cost",
                title: "Total Cost",
                type: "link",
              },
              {
                path: "/transactions/topup-personal",
                title: "Top Up",
                type: "link",
              },
              {
                path: "/transactions/topup-history",
                title: "Top Up History",
                type: "link",
              },
              {
                path: "/transactions/company-withdrawal-history",
                title: "School's Withdrawal",
                type: "link",
              },
              {
                path: "/transactions/vendor-withdrawal-history",
                title: "Vendor Withdrawal",
                type: "link",
              },
              // {
              //   path: "/transactions/voided-transactions",
              //   title: "Voided Transactions",
              //   type: "link",
              // },
            ],
          },
        ];
        this.items.next(this.MENUITEMS);
        break;
      case "sid":
        this.MENUITEMS = [
          {
            title: "Dashboard",
            icon: "activity",
            type: "link",
            badgeType: "primary",
            active: true,
            path: "/dashboard",
          },
          {
            title: "Auth",
            icon: "users",
            type: "sub",
            badgeType: "primary",
            active: true,
            children: [
              {
                path: "/user/company-list",
                title: "All Schools",
                type: "link",
                icon: "anchor",
                badgeType: "primary",
                active: false,
                // children: [
                //   {
                //     path: "/user/company-create",
                //     title: "Add Company",
                //     type: "link",
                //   },
                //   {
                //     path: "/user/company-list",
                //     title: "All Company",
                //     type: "link",
                //   },
                // ],
              },
              {
                path: "/user/company-admin-list",
                title: "All Admin",
                type: "link",
                icon: "anchor",
                badgeType: "primary",
                active: false,
              },
              {
                icon: "anchor",
                badgeType: "primary",
                active: false,
                path: "/user/accountant-list",
                title: "All Accountants",
                type: "link",
              },
              {
                icon: "anchor",
                badgeType: "primary",
                active: false,
                path: "/user/staff-list",
                title: "All Students",
                type: "link",
              },
              {
                icon: "anchor",
                badgeType: "primary",
                active: false,
                path: "/user/department-list",
                title: "Departments",
                type: "link",
              },
              {
                icon: "anchor",
                badgeType: "primary",
                active: false,
                path: "/user/vendor-list",
                title: "All Vendors",
                type: "link",
              },
            ],
          },
          {
            title: "Transactions",
            icon: "file-text",
            type: "sub",
            badgeType: "primary",
            active: true,
            children: [
              {
                path: "/transactions/order-history",
                title: "Order History",
                type: "link",
              },
              {
                path: "/transactions/total-cost",
                title: "Total Cost",
                type: "link",
              },
              {
                path: "/transactions/topup-history",
                title: "Top Up History",
                type: "link",
              },
              {
                path: "/transactions/company-withdrawal-history",
                title: "School's Withdrawal",
                type: "link",
              },
              {
                path: "/transactions/vendor-withdrawal-history",
                title: "Vendor Withdrawal",
                type: "link",
              },
              {
                path: "/transactions/sid-withdrawal-history",
                title: "SID Withdrawal",
                type: "link",
              },
              // {
              //   path: "/transactions/voided-transactions",
              //   title: "Voided Transactions",
              //   type: "link",
              // },
            ],
          },
        ];
        this.items.next(this.MENUITEMS);
        break;

      default:
        break;
    }
  }
}
