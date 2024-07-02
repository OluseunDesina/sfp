import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from "../../../environments/environment";
import { PaginatedResponse } from "../models/response.model";

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = environment.url
  private vendors
  private vendorsListener = new Subject<PaginatedResponse>()

  constructor(
    private http: HttpClient
  ) { }

  getVendors() {
    this.http.get<PaginatedResponse>(`${this.apiUrl}auth/vendor/`)
    .subscribe((response) => {
      this.vendors = response
      this.vendorsListener.next({ ...this.vendors })

    }, (err) => {
    })
  }

  getVendorsListener() {
    return this.vendorsListener.asObservable()
  }


}
