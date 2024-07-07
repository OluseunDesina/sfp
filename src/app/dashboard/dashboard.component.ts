import { AfterViewInit, Component, OnInit } from "@angular/core";
import { DialogService } from "../shared/services/dialog.service";
import { HelperService } from "../shared/services/helper.service";
import { TransactionService } from "../transactions/transaction.service";
import { DashboardService } from "./dashboard.service";
import { distinct, shareReplay } from "rxjs/operators";

declare var require: any;
var Knob = require("knob"); // browserify require
var primary = localStorage.getItem("primary_color") || "#27AE60";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  states: any[] = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
    "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory (FCT)"
];
  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  barChartLegend = false;
  barChartType = "bar";
  barChartColors: Array<any> = [
    {
      backgroundColor: "#27AE60",
      borderColor: "rgba(30, 166, 236, 0.8)",
      borderWidth: 1,
    },
    {
      backgroundColor: "#27AE60",
      borderColor: "rgba(68, 102, 242, 0.8)",
      borderWidth: 1,
    },
  ];

  barChartData: any[] = [{ data: [] }];
  barChartLabels: string[] = [];

  saleChartType = "line";
  transactionRatio: number;

  saleChartLabels: Array<any> = [
    "2009",
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
  ];
  saleChartData: Array<any> = [0, 2.25, 1.25, 3, 1.25, 2.25, 0];
  saleChartOptions: any = {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            color: "#fff",
            drawTicks: true,
          },
        },
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  saleChartColors: Array<any> = [
    {
      fill: false,
      borderColor: primary,
      borderWidth: 2.5,
      pointBackgroundColor: primary,
      pointBorderColor: primary,
    },
  ];
  saleChartLegend = false;

  private today;
  orderHistory: any[] = [];
  orderLoading: boolean = true;
  customOptions: any = {
    margin: 10,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    center: true,
    loop: true,
    autoHeight: true,
    autoWidth: true,
    dots: false,
    nav: false,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      420: {
        items: 2,
      },
      600: {
        items: 3,
      },
      932: {
        items: 4,
      },
    },
    stagePadding: 50,
  };
  slidesStore = [];
  studentsByLGA = [];
  studentsBySchool = [];
  caterersByLGA = [];
  farmersByLGA = [];
  vendorReport: any[];
  dataset1: any[];
  dataset2: any[];
  ratioArray: any[] = [];
  isStaff: boolean;
  isSid: boolean;
  isComp: boolean;
  isVend: boolean;
  isAcct: boolean;
  latestMeal: any;
  students = 100;
  schools = 500;
  farmers = 50;
  caterers = 200;
  selectedState: any = 0;

  constructor(
    private dashboardService: DashboardService,
    private transactionService: TransactionService,
    private helperService: HelperService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getuserGroup();
    this.orderHistory = [];
    this.slidesStore = [];
    this.studentsByLGA = [
      {title: 'Total', count: 100},
      {title: 'KOSOFE', count: 10},
      {title: 'ALIMOSHO', count: 9},
      {title: 'SURULERE', count: 15},
      {title: 'ETI-OSA', count: 25},
    ];
    this.farmersByLGA = [
      {title: 'Total', count: 100},
      {title: 'KOSOFE', count: 10},
      {title: 'ALIMOSHO', count: 9},
      {title: 'SURULERE', count: 15},
      {title: 'ETI-OSA', count: 25},
    ];
    this.caterersByLGA = [
      {title: 'Total', count: 100},
      {title: 'KOSOFE', count: 10},
      {title: 'ALIMOSHO', count: 9},
      {title: 'SURULERE', count: 15},
      {title: 'ETI-OSA', count: 25},
    ];
    this.studentsBySchool = [
      {title: 'Total', count: 100},
      {title: 'FGGC', count: 10},
      {title: 'ICHS', count: 11},
      {title: `BRIGG's Gate`, count: 25},
      {title: 'AGGS', count: 30},
    ];
    this.orderLoading = true;
    this.today = this.helperService.formatDate(new Date());
    this.getFoodReport();
    this.getOrderHistory();
    this.getLatestMeal();
    // var review = Knob({
    //   value: 35,
    //   angleOffset: 180,
    //   className: "review",
    //   thickness: 0.1,
    //   width: 290,
    //   height: 290,
    //   fgColor: primary,
    // });
    // document.getElementById("review").append(review);
  }

  onStateChange() {
    if (this.selectedState == 0) {
      this.students = 100;
      this.schools = 500;
      this.farmers = 50;
      this.caterers = 200
      return
    }
    this.students = Math.floor(Math.random() * 100)
    this.schools = Math.floor(Math.random() * 500)
    this.farmers = Math.floor(Math.random() * 50)
    this.caterers = Math.floor(Math.random() * 200)
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.getUserReport();
    this.dashboardService.getCarouselData().subscribe((data) => {
      this.slidesStore = data.filter((element) => {
        if (element.count != null && element.count != 0) {
          return element;
        }
      });
    });
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "emp":
        this.isStaff = true;
        break;
      case "ven":
        this.isVend = true;
        break;
      case "cmp_adm":
        this.isComp = true;
        this.getVendorReport();
        this.getRatioReport();
        break;
      case "sid":
        this.isSid = true;
        this.getVendorReport();
        this.getRatioReport();
        break;
      case "cmp_act":
        this.isAcct = true;
        this.getVendorReport();
        this.getRatioReport();
        break;

      default:
        break;
    }
  }

  // events
  chartClicked(e: any): void { }

  chartHovered(e: any): void { }

  getVendorReport() {
    this.dashboardService.getVendorReport().subscribe((data) => {
      this.vendorReport = data;
    });
  }

  getFoodReport() {
    this.dashboardService.getFoodReport().subscribe((data) => {
      this.barChartLabels = data.map((element: { food__name: string; }) => {
        return element.food__name.length > 15
          ? `${element.food__name.substring(0, 13)}...`
          : element.food__name;
      });
      this.barChartData[0].data = this.dataset1 = data.map(
        (element) => element.dcount
      );
      this.dataset2 = data.map((element) => element.dtotal);
    });
  }

  getRatioReport() {
    this.dashboardService
      .getRatioReport()
      .subscribe((data: { title: string; count: number; }[]) => {
        this.ratioArray = data.map((element) => {
          return {
            ...element,
            percentage: `${element.count}%`,
            class: `radial-bar-${Math.ceil(element.count / 5) * 5}`,
          };
        });
      });
  }

  getOrderHistory() {
    this.orderLoading = true;
    this.transactionService
      .getOrderHistory(this.today, this.today)
      .subscribe((data) => {
        this.orderHistory = data.results;
        this.orderLoading = false;
      });
  }

  getLatestMeal() {
    this.dashboardService.getLatestMeal()
      .pipe(
        shareReplay(1),
        distinct()
      )
      .subscribe(
        (data) => {
          this.latestMeal = data;
          if (this.latestMeal?.has_reviewed == false) {
            this.dialogService.surveyDialog(data, {disableClose: true});
          }
        }
      );
  }

}
