import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, merge, pipe, Subject } from "rxjs";
import { map, toArray } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private url = environment.url;
  private vendorReport: any[];
  private vendorReportUpdate = new Subject<any[]>();
  private foodReport: any[];
  private foodReportUpdate = new Subject<any[]>();
  private ratioReport: any;
  private ratioReportUpdate = new Subject<any>();
  private latestMeal: any;
  private latestMealSubject = new Subject<any>();
  // private userReport: any[];
  // private userReportUpdate = new Subject<any[]>();
  // private transactionReport: any[];
  // private transactionReportUpdate = new Subject<any[]>();

  constructor(private http: HttpClient) { }

  // getUserReport() {
  //   this.http.get<any[]>(`${this.url}auth/user-report/`).subscribe(
  //     (response) => {
  //       this.userReport = response;
  //       this.userReportUpdate.next([...this.userReport]);
  //     },
  //     (err) => {
  //       this.userReport = [];
  //       this.userReportUpdate.next([...this.userReport]);
  //     }
  //   );
  //   return this.userReportUpdate.asObservable()
  // }

  getVendorReport() {
    this.http.get<any[]>(`${this.url}txn/vendor-report/`).subscribe(
      (response) => {
        this.vendorReport = response;
        this.vendorReportUpdate.next([...this.vendorReport]);
      },
      (err) => {
        this.vendorReport = [];
        this.vendorReportUpdate.next([...this.vendorReport]);
      }
    );

    return this.vendorReportUpdate.asObservable();
  }

  getFoodReport() {
    this.http.get<any[]>(`${this.url}txn/food-report/`).subscribe(
      (response) => {
        this.foodReport = response;
        this.foodReportUpdate.next([...this.foodReport]);
      },
      (err) => {
        this.foodReport = [];
        this.foodReportUpdate.next([...this.foodReport]);
      }
    );

    return this.foodReportUpdate.asObservable();
  }

  getRatioReport() {
    this.http.get<any[]>(`${this.url}txn/ratio-report/`).subscribe(
      (response) => {
        this.ratioReport = response;
        this.ratioReportUpdate.next([...this.ratioReport]);
      },
      (err) => {
        this.ratioReport = [];
        this.ratioReportUpdate.next([...this.ratioReport]);
      }
    );

    return this.ratioReportUpdate.asObservable();
  }

  getCarouselData() {
    // Use Rxjs forkJoin to combine data from two endpoints and then map the data to one array
    return forkJoin(
      this.http.get<any[]>(`${this.url}txn/transaction-report/`),
      this.http.get<any[]>(`${this.url}auth/user-report/`)
    ).pipe(
      map(([s1, s2]) => {
        return [...s1, ...s2];
      })
    );
    // .subscribe((data) => {
    // })
  }

  // getTransactionReport() {
  //   this.http.get<any[]>(`${this.url}txn/transaction-report/`).subscribe(
  //     (response) => {
  //       this.transactionReport = response;
  //       this.transactionReportUpdate.next([...this.transactionReport]);
  //     },
  //     (err) => {
  //       this.transactionReport = [];
  //       this.transactionReportUpdate.next([...this.transactionReport]);
  //     }
  //   );
  //   return this.transactionReportUpdate.asObservable()
  //   // txn/vendor-report/
  // }

  getLatestMeal() {
    this.http.get<any>(`${this.url}txn/bulk-order/latest-meal/`).subscribe(
      (response) => {
        this.latestMeal = response.data;
        this.latestMealSubject.next({ ...this.latestMeal });
      }
    );
    return this.latestMealSubject.asObservable();
  }

  rateVendor(data) {
    return this.http.post(`${this.url}auth/vendor-rating/`, data);
  }

  getRatingList(vendorId, startDate, endDate) {
    const query = `?${startDate && endDate ? "start_date=" + startDate + "&end_date=" + endDate : ""}`;
    return this.http.get<any>(`${this.url}auth/vendor-rating/${vendorId}/stats/${query}`);
  }


}
