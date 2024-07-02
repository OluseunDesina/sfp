import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private bankList: any[] = [];
  private bankListUpdate = new Subject<any[]>();
  private httpGETOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
    }),
    };

  constructor(
    private http: HttpClient,
    private handler: HttpBackend
  ) {
    this.http = new HttpClient(handler)
  }

  getPayStackBankList() {
    // let handler: HttpBackend
    // this.http = new HttpClient(handler)
    this.http.get(`https://api.paystack.co/bank`)
    .pipe(
      shareReplay()
    )
    .subscribe((res: any) => {
      this.bankList = res.data
      this.bankListUpdate.next([ ...this.bankList ])
    })

    return this.bankListUpdate.asObservable()
  }
}
