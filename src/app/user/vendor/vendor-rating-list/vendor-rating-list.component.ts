import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../../user.service';
import { FoodService } from "src/app/shared/services/food.service";
import { HelperService } from 'src/app/shared/services/helper.service';

import { FormControl, FormGroup } from "@angular/forms";
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { NotificationService } from 'src/app/shared/services/notification.service';


@Component({
  selector: 'app-vendor-rating-list',
  templateUrl: './vendor-rating-list.component.html',
  styleUrls: ['./vendor-rating-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class VendorRatingListComponent implements OnInit {
  dataSource: any[] = [];

  displayedColumns: any[] = [];
  noDataColumns: any[] = [];
  columnsToDisplay = ['name', 'review', 'rating', 'created_at'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: any | null;
  tableLoading: boolean = true;

  private pageSize: number;
  private pageIndex: number;
  length: number;

  private vendorId: string;
  title = "";

  startDate: string;
  endDate: string;
  private company: string = "";

  allowSearch: boolean = false;
  mealType: number;
  mealTypes: any[];

  isStaff: boolean;
  isSid: boolean;
  isComp: boolean;
  isVend: boolean;
  isAcct: boolean;
  allTimeRatings: any;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  errorMessage: string;


  constructor(private userService: UserService, private route: ActivatedRoute, private _location: Location,
    private helperService: HelperService,
    private foodService: FoodService, private dashboardService: DashboardService, private notificationService: NotificationService) {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.vendorId = paramMap.get("id");
      this.title = paramMap.get("vendor_name");
    });
  }

  ngOnInit(): void {
    this.pageSize = 10;
    this.tableLoading = true;
    this.getVendorRatings();
    this.getuserGroup();
    this.getRatingList();
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "emp":
        this.isStaff = true;
        this.displayedColumns = [
          // "position",
          "id",
          "food",
          "quantity",
          "platform",
          "vendor_user_id",
          "meal_type",
          "status",
          "star",
        ];
        this.getMealTypes();
        break;
      case "ven":
        this.isVend = true;
        this.allowSearch = true;
        this.displayedColumns = [
          // "position",
          "id",
          "user",
          "company",
          "food",
          "quantity",
          "platform",
          "comment",
          "meal_type",
          "status",
          "star",
        ];
        this.getMealTypes();
        break;
      case "cmp_adm":
        this.displayedColumns = [
          // "position",
          "id",
          "user",
          "vendor",
          "food",
          "quantity",
          "platform",
          "comment",
          "meal_type",
          "status",
          "star",
        ];
        this.isComp = true;
        this.allowSearch = true;
        this.getMealTypes();
        break;
      case "cmp_act":
        this.displayedColumns = [
          // "position",
          "id",
          "user",
          "vendor",
          "food",
          "quantity",
          "platform",
          "comment",
          "meal_type",
          "status",
          "star",
        ];
        this.isAcct = true;
        this.allowSearch = true;
        break;
      case "sid":
        this.isSid = true;
        this.allowSearch = true;
        this.displayedColumns = [
          "id",
          "company",
          "user",
          "vendor",
          "food",
          "quantity",
          "platform",
          "comment",
          "meal_type",
          "status",
          "star",
        ];
        this.getMealTypes();
        break;

      default:
        break;
    }
  }

  goBack() {
    this._location.back();
  }

  getVendorRatings() {
    this.tableLoading = true;
    this.userService.getVendorRatings(this.vendorId, this.startDate, this.endDate, this.mealType, this.pageSize, this.pageIndex);
    this.userService.getVendorRatingsUpdate().subscribe((vendorRatings) => {
      this.dataSource = vendorRatings.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
      this.length = vendorRatings.count;
      this.length > 0 ? this.noDataColumns = [] : this.noDataColumns = ["disclaimer"];
      this.tableLoading = false;
    }, (error) => {
      this.dataSource = [];
      this.length = 0;
      this.length > 0 ? this.noDataColumns = [] : this.noDataColumns = ["disclaimer"];
      this.errorMessage = error.error.message;
      this.tableLoading = false;
    });
  }

  getMealTypes() {
    this.foodService.getMealTypes().subscribe((mealTypes) => {
      const mealTypeArray = mealTypes.map((element) => {
        return { name: element.name, id: element.id };
      });
      this.mealTypes = [{ id: "", name: "All" }, ...mealTypeArray];
    });
  }

  onMealTypeChange(value) {
    this.mealType = value;
    this.getVendorRatings();
    this.tableLoading = true;
  }

  setStartDate(value) {
    this.startDate = this.helperService.formatDate(value.value);
  }

  setEndDate(value) {
    this.endDate = this.helperService.formatDate(value.value);
    this.getVendorRatings();
    this.getRatingList();
    this.tableLoading = true;
  }

  getRatingList() {
    this.dashboardService.getRatingList(this.vendorId, this.startDate, this.endDate).subscribe(
      (response) => {
        this.allTimeRatings = response.data;
      }
    );
  }

  onDownload() {
    const oldPageSize = this.pageSize;
    this.pageSize = this.length;
    this.getVendorRatings();
    this.userService.getVendorRatingsUpdate().subscribe((vendorRatings) => {
      this.dataSource = vendorRatings.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
      const fileName = this.title + " Ratings";
      const dataSource = this.dataSource.map((element) => {
        return {
          "name": element.food.name,
          "review": element.review,
          "rating": element.rating,
          "created_at": element.created_at
        };
      });
      this.helperService.exportExcel(dataSource, fileName, this.columnsToDisplay);
      this.pageSize = oldPageSize;
      this.getVendorRatings();
    }, (error) => {
      this.notificationService.danger("Error", "Unable to download file, please contact Admin.");
      this.getVendorRatings();
    });
  }

  pageChange(value: { pageSize: number; pageIndex: number; }) {
    this.tableLoading = true;
    this.pageSize = value.pageSize;
    this.pageIndex = value.pageIndex;
    this.getVendorRatings();
  }

}

