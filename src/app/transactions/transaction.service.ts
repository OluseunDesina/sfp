import { HttpClient } from "@angular/common/http";
import { Injectable, Query } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { PaginatedResponse } from "../shared/models/response.model";
import { CartService } from "../shared/services/cart.service";
import { NotificationService } from "../shared/services/notification.service";
import { Order, OrderResponse } from "./order";
import { TotalCostResponse, TotalCost } from "./total-cost";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  private apiUrl = environment.url;
  private orderHistory: OrderResponse = new OrderResponse();
  private orderHistoryListener = new BehaviorSubject<OrderResponse>(
    this.orderHistory
  );
  private topupHistorty: any[] = [];
  private topupHistortyListener = new BehaviorSubject<any[]>(
    this.topupHistorty
  );
  private totalCostList: TotalCostResponse = new TotalCostResponse();
  private totalCostListListener = new BehaviorSubject<TotalCostResponse>(
    this.totalCostList
  );
  private sidWithdrawal: PaginatedResponse = new PaginatedResponse();
  private sidWithdrawalListener = new BehaviorSubject<PaginatedResponse>(
    this.sidWithdrawal
  );
  private companyWithrawal: any[] = [];
  private companyWithrawalListener = new BehaviorSubject(this.companyWithrawal);
  private vendorWithrawal: PaginatedResponse = new PaginatedResponse();
  private vendorWithrawalListener = new BehaviorSubject<PaginatedResponse>(
    this.vendorWithrawal
  );
  private voidedTransactions: any[] = [];
  private voidedTransactionsListener = new BehaviorSubject(
    this.voidedTransactions
  );
  private dailyLimit = 0;
  private dailyLimitListener = new BehaviorSubject(this.dailyLimit);
  private isLoadingListener = new Subject<boolean>();
  private reference: string;
  private referenceUpdate = new Subject<string>();
  private cashingOutUpdate = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private cartService: CartService,
    private router: Router
  ) {}

  getDailyLimit(delivery_date) {
    const query = `?delivery_date=${delivery_date}`;
    this.http.get(`${this.apiUrl}txn/get/daily_limit/${query}`).subscribe(
      (response: any) => {
        if ((response.code = 200)) {
          this.dailyLimit = response.daily_limit_left;
        } else {
          this.dailyLimit = 0;
        }
        this.dailyLimitListener.next(this.dailyLimit);
      },
      (err) => {
        this.dailyLimit = 0;
        this.dailyLimitListener.next(this.dailyLimit);
      }
    );

    return this.dailyLimitListener.asObservable();
  }

  getVoidedTransactions(
    order_date_start,
    order_date_end,
    status = ``,
    comp = ``,
    pageSize = 10,
    pageIndex = 1
  ) {
    const query = `?limit=${pageSize}&offset=${pageIndex}&order_date_start=${order_date_start}&order_date_end=${order_date_end}${
      status ? "&status=" + status : ""
    }${comp ? "&comp=" + comp : ""}`;
    this.http.get(`${this.apiUrl}txn/void/${query}`).subscribe(
      (response: any) => {
        this.voidedTransactions = response.result;
        this.voidedTransactionsListener.next([...this.voidedTransactions]);
      },
      (err) => {
        this.voidedTransactions = [];
        this.voidedTransactionsListener.next([...this.voidedTransactions]);
      }
    );

    return this.orderHistoryListener.asObservable();
  }

  getOrderHistory(
    delivery_date_start,
    delivery_date_end,
    status = ``,
    comp = ``,
    vendor = null,
    meal_type = null,
    pageSize = 7,
    pageIndex = 1,
    search = ""
  ) {
    this.orderHistory.results = [];
    this.orderHistoryListener.next({ ...this.orderHistory });
    const query = `?limit=${pageSize}&offset=${pageIndex}&delivery_date_start=${delivery_date_start}&delivery_date_end=${delivery_date_end}${
      status ? "&status=" + status : ""
    }${comp ? "&comp=" + comp : ""}${meal_type ? "&meal_type=" + meal_type : ""}${vendor ? "&vendor=" + vendor : ""}${
      search ? "&search=" + search : ""
    }`;
    this.http
      .get<OrderResponse>(`${this.apiUrl}txn/order-history/${query}`)
      .subscribe(
        (response: any) => {
          this.orderHistory = response;
          this.orderHistoryListener.next({ ...this.orderHistory });
        },
        (err) => {
          this.orderHistory = new OrderResponse();
          this.orderHistory.results = [];
          this.orderHistoryListener.next({ ...this.orderHistory });
        }
      );

    return this.orderHistoryListener.asObservable();
  }

  downloadOrderHistory(
    delivery_date_start,
    delivery_date_end,
    status = ``,
    comp = ``,
    vendor = null,
    meal_type = null,
    pageSize = 7,
    pageIndex = 1,
    search = ""
  ) {
    const query = `?limit=${pageSize}&offset=${pageIndex}&delivery_date_start=${delivery_date_start}&delivery_date_end=${delivery_date_end}${
      status ? "&status=" + status : ""
    }${comp ? "&comp=" + comp : ""}${meal_type ? "&meal_type=" + meal_type : ""}${vendor ? "&vendor=" + vendor : ""}${
      search ? "&search=" + search : ""
    }`;
    return this.http
      .get<OrderResponse>(`${this.apiUrl}txn/order-history/${query}`)


  }

  getTotalCost(
    delivery_start,
    delivery_end,
    comp = ``,
    pageSize = 10,
    pageIndex = 1,
    search = ""
  ) {
    this.orderHistory.results = [];
    this.orderHistoryListener.next({ ...this.orderHistory });
    const query = `?limit=${pageSize}&offset=${pageIndex}&delivery_start=${delivery_start}&delivery_end=${delivery_end}${
      comp ? "&comp=" + comp : ""
    }${search ? "&search=" + search : ""}`;
    this.http
      .get<TotalCostResponse>(`${this.apiUrl}txn/split-report/${query}`)
      .subscribe(
        (response: any) => {
          this.totalCostList = response;
          this.totalCostListListener.next({ ...this.totalCostList });
        },
        (err) => {
          this.totalCostList = new TotalCostResponse();
          this.totalCostListListener.next({ ...this.totalCostList });
        }
      );
    return this.totalCostListListener.asObservable();
  }

  getTopUpHistory(
    date_start,
    date_end,
    // status = ``,
    comp = ``,
    pageSize = 10,
    pageIndex = 1
  ) {
    const query = `?limit=${pageSize}&offset=${pageIndex}&date_start=${date_start}&date_end=${date_end}${
      comp ? "&comp=" + comp : ""
    }`;
    this.http.get(`${this.apiUrl}txn/topup-history/${query}`).subscribe(
      (response: any) => {
        if (response.code == 200) {
          comp ? this.topupHistorty = response.staff_topup_history : this.topupHistorty = response.company_topup_history;
          // this.topupHistorty = response.staff_topup_history;
          this.topupHistortyListener.next([...this.topupHistorty]);
        } else {
          this.topupHistorty = [];
          this.topupHistortyListener.next([...this.topupHistorty]);
        }
      },
      (err) => {
        this.topupHistorty = [];
        this.topupHistortyListener.next([...this.topupHistorty]);
      }
    );

    return this.topupHistortyListener.asObservable();
  }

  cancelOrder(food) {
    // food.status = "cancelled"
    this.isLoadingListener.next(true);
    this.http
      .patch(`${this.apiUrl}txn/bulk-order/${food.id}/`, {
        status: "cancelled",
      })
      .subscribe(
        (response: { code: number; message: string }) => {
          if (response.code == 200) {
            this.notificationService.success("Success", response.message);
          } else {
            this.notificationService.warning("Error", response.message);
          }
          this.isLoadingListener.next(false);
        },
        (err: any) => {
          this.isLoadingListener.next(false);
          const errorMessage = err.error.message || err.error.details;
          this.notificationService.warning("Error", errorMessage);
        }
      );
    return this.isLoadingListener.asObservable();
  }

  void(txn_id) {
    this.isLoadingListener.next(true);
    this.http.post(`${this.apiUrl}txn/void_txn/`, { txn_id }).subscribe(
      (response: { code: number; message: string }) => {
        if (response.code == 200) {
          this.notificationService.success("Success", response.message);
        } else {
          this.notificationService.warning("Error", response.message);
        }
        this.isLoadingListener.next(false);
      },
      (err: any) => {
        this.isLoadingListener.next(false);
        const errorMessage = err.error.message || err.error.details;
        this.notificationService.warning("Error", errorMessage);
      }
    );
    return this.isLoadingListener.asObservable();
  }

  adminDeliver(receipt_id) {
    this.isLoadingListener.next(true);
    this.http
      .post(`${this.apiUrl}txn/vendor/confirm_order/`, { receipt_id })
      .subscribe(
        (response: { code: number; message: string }) => {
          if (response.code == 200) {
            this.notificationService.success("Success", response.message);
          } else {
            this.notificationService.warning("Error", response.message);
          }
          this.isLoadingListener.next(false);
        },
        (err: any) => {
          this.isLoadingListener.next(false);
          const errorMessage = err.error.message || err.error.details;
          this.notificationService.warning("Error", errorMessage);
        }
      );
    return this.isLoadingListener.asObservable();
  }

  getSidWithdrawalHistory(date_start, date_end) {
    const query = `?date_start=${date_start}&date_end=${date_end}`;
    this.http
      .get(`${this.apiUrl}txn/sid/withdrawal_history/${query}`)
      .subscribe(
        (response: any) => {
          this.sidWithdrawal = response;
          this.sidWithdrawalListener.next({ ...this.sidWithdrawal });
        },
        (err) => {
          this.sidWithdrawal = new PaginatedResponse();
          this.sidWithdrawal.results = [];
          this.sidWithdrawalListener.next({ ...this.sidWithdrawal });
        }
      );

    return this.sidWithdrawalListener.asObservable();
  }

  getCompanyWithdrawalHistory(date_start, date_end) {
    const query = `?date_start=${date_start}&date_end=${date_end}`;
    this.http
      .get(`${this.apiUrl}txn/company/withdrawal_history/${query}`)
      .subscribe(
        (response: any) => {
          if (response.code == 200) {
            this.companyWithrawal = response.result;
            this.companyWithrawalListener.next([...this.companyWithrawal]);
          } else {
            this.companyWithrawal = [];
            this.companyWithrawalListener.next([...this.companyWithrawal]);
          }
        },
        (err) => {
          this.companyWithrawal = [];
          this.companyWithrawalListener.next([...this.companyWithrawal]);
        }
      );

    return this.companyWithrawalListener.asObservable();
  }

  getVendorWithdrawalHistory(date_start, date_end) {
    const query = `?date_start=${date_start}&date_end=${date_end}`;
    this.http
      .get(`${this.apiUrl}txn/vendor/withdrawal_history/${query}`)
      .subscribe(
        (response: any) => {
          this.vendorWithrawal = response;
          this.vendorWithrawalListener.next({ ...this.vendorWithrawal });
        },
        (err) => {
          this.vendorWithrawal = new PaginatedResponse();
          this.vendorWithrawal.results = [];
          this.vendorWithrawalListener.next({ ...this.vendorWithrawal });
        }
      );

    return this.vendorWithrawalListener.asObservable();
  }

  placeOrder(orders) {
    this.isLoadingListener.next(true);
    const data = {
      orders: orders.map((element) => {
        return {
          food: element.id,
          comment: element.comment || "",
          delivery_date: element.delivery_date,
          quantity: element.quantity,
          meal_type: element.meal_type,
        };
      }),
      platform: `WEB`,
      place: "company",
    };
    this.http.post(`${this.apiUrl}txn/bulk-order/`, data).subscribe(
      (response: any) => {
        if ((response.code = "201")) {
          this.notificationService.success(`Success`, response.status);
          this.cartService.clearCart();
          this.router.navigate(["/transactions/order-history"]);
        } else {
          this.notificationService.success(`Success`, response.status);
        }
        this.isLoadingListener.next(false);
      },
      (err) => {
        this.notificationService.warning(`Error`, err.error.message);
        this.isLoadingListener.next(false);
      }
    );
  }

  getReference() {
    this.http
      .get<any>(`${this.apiUrl}txn/generate/topup_code/`)
      .pipe(shareReplay())
      .subscribe((response) => {
        if (response.code == 200) {
          this.reference = response.ref;
          this.referenceUpdate.next(this.reference);
        }
      });

    return this.referenceUpdate.asObservable();
  }

  cashout(comp_id, cash_out_amount) {
    let query;
    comp_id ? (query = `?comp_id=${comp_id}`) : (query = `?cash_out_amount=${cash_out_amount}`);
    this.http
      .get<any>(`${this.apiUrl}txn/cashout${query}`)
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.cashingOutUpdate.next(false);
          if (response.code == 200) {
            this.notificationService.success(`Success`, `${response.message}`);
          } else {
            this.notificationService.warning(`Error`, `${response.message}`);
          }
        },
        (err) => {
          const errorMessage =
            err.error.message || err.error.details || `Please contact Admin`;
          this.notificationService.warning(`Error`, errorMessage);
          this.cashingOutUpdate.next(false);
        }
      );
    return this.cashingOutUpdate.asObservable();
  }

  getPaystackBalance() {
    return this.http
    .get<any>(`${this.apiUrl}txn/paystack-wallet-balance/`)
    .pipe(shareReplay())

  }

  triggerCashouts(company) {
    this.http
      .post<any>(`${this.apiUrl}txn/check-cashout/`, {
        company,
      })
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.cashingOutUpdate.next(false);
          this.notificationService.success(
            response.status,
            `${response.message}`
          );
        },
        (err) => {
          const errorMessage =
            err.error.message || err.error.details || `Please contact Admin`;
          this.notificationService.warning(`Error`, errorMessage);
          this.cashingOutUpdate.next(false);
        }
      );

    return this.cashingOutUpdate.asObservable();
  }

  triggerTopups(company) {
    this.http
      .post<any>(`${this.apiUrl}txn/auto-topup/`, {
        company,
      })
      .pipe(shareReplay())
      .subscribe(
        (response) => {
          this.cashingOutUpdate.next(false);
          this.notificationService.success(
            response.status,
            `${response.message}`
          );
        },
        (err) => {
          const errorMessage =
            err.error.message || err.error.details || `Please contact Admin`;
          this.notificationService.warning(`Error`, errorMessage);
          this.cashingOutUpdate.next(false);
        }
      );

    return this.cashingOutUpdate.asObservable();
  }

  getIsLoading() {
    return this.isLoadingListener.asObservable();
  }

  updateTransaction(transactionId, status) {}
}
