import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie";

@Injectable()
export class AppIdInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const appId = this.cookieService.get("appId");
    let httpReq = request;
    if (appId) {
      httpReq = request.clone({
        setHeaders: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
          "App-id": appId,
        },
      });
    }
    return next.handle(httpReq);
  }
}
