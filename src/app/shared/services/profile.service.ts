import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Subject } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { ErrorService } from "./error.service";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private apiUrl = environment.url;
  private userInfo: any = null;
  private userInfoListener = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private errorService: ErrorService
  ) {}

  getUSerInfo() {
    this.http
      .get(`${this.apiUrl}auth/user-info/`)
      // .pipe(shareReplay())
      .subscribe(
        (res) => {
          this.userInfo = res;
          this.userInfoListener.next(this.userInfo);
        },
        (err) => {
          this.notificationService.warning(`Error`, `Failed to load user info`);
          this.userInfoListener.next(null);
        }
      );
    return this.userInfoListener.asObservable();
  }
}
