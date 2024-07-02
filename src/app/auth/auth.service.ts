import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { LoginError, LoginInfo, LoginResponse, User } from "./login-info";
import { HelperService } from "../shared/services/helper.service";
import { ErrorService } from "../shared/services/error.service";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { shareReplay } from "rxjs/operators";
import { CookieService } from "ngx-cookie";
import { NotificationService } from "../shared/services/notification.service";
import { CartService } from "../shared/services/cart.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = environment.url;
  private isLoadingListener = new Subject<boolean>();
  private profileListener = new Subject<boolean>();
  private accessToken: string;
  private refreshToken: string;
  private userInfo: User;
  private isAuth: boolean;
  private isAuthListener = new Subject<boolean>();
  private appId: string;
  userGroup: string;

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private errorService: ErrorService,
    private router: Router,
    private cookieService: CookieService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  getIsLoadingListener() {
    return this.isLoadingListener.asObservable();
  }

  getProfileListener() {
    return this.profileListener.asObservable();
  }

  login(loginInfo: LoginInfo, loginDialogRef) {
    this.isLoadingListener.next(true);
    const loginData = {
      password: loginInfo.password,
      email: this.helperService.lowerCase(loginInfo.email),
    };
    this.http
      .post(`${this.url}auth/login/`, loginData)
      .pipe(shareReplay())
      .subscribe(
        (response: LoginResponse) => {
          // handle successful login.
          const token = response.access;
          if (token) {
            this.isAuth = true;
            this.isAuthListener.next(this.isAuth);
            this.accessToken = response.access;
            this.refreshToken = response.refresh;
            this.appId = response.app_id;
            const expiresIn = response.access_duration;
            this.userInfo = response.user;
            this.userGroup = response.user.role;
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresIn * 1000);
            this.saveAuthData(
              this.accessToken,
              this.refreshToken,
              this.userInfo,
              expirationDate,
              this.appId,
              this.userGroup
            );
            this.isLoadingListener.next(false);
            loginDialogRef.close();
            this.router.navigate(["/dashboard"]);
          }
        },
        (err: any) => {
          // return error and resolve to user.
          this.isLoadingListener.next(false);
          if (err.error.code == 406) {
            this.forgotPassword(loginInfo);
            loginDialogRef.close();
            return;
          }
          let errorMessage;
          err.error.message
            ? (errorMessage = err.error.message)
            : `An error message occured`;
          this.errorService.handleError(errorMessage);
        }
      );
  }

  saveAuthData(token, refresh, userInfo, expiryDate, appId, userGroup) {
    this.cookieService.put(`token`, token);
    this.cookieService.put(`refresh`, refresh);
    this.cookieService.put(`appId`, appId);
    this.cookieService.put(`userInfo`, JSON.stringify(userInfo));
    this.cookieService.put(`expiryDate`, JSON.stringify(expiryDate));
    this.cookieService.put(`userGroup`, JSON.stringify(userGroup));
  }

  private clearAuthData() {
    this.cookieService.remove(`token`);
    this.cookieService.remove(`refresh`);
    this.cookieService.remove(`appId`);
    this.cookieService.remove(`userInfo`);
    this.cookieService.remove(`expiryDate`);
    this.cookieService.remove(`userGroup`);
    this.cookieService.removeAll();
    this.cartService.clearCart();
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    const now = new Date();
    const expirationDate = new Date(authData.expirationDate);
    const expiresIn = expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.accessToken = authData.token;
      this.refreshToken = authData.refresh;
      this.appId = authData.appID;
      this.userInfo = authData.userInfo;
      this.userGroup = authData.userGroup;
      this.isAuth = true;
      this.isAuthListener.next(this.isAuth);
    }
  }

  getAuthData() {
    return {
      token: this.cookieService.get("token"),
      refresh: this.cookieService.get("refresh"),
      appID: this.cookieService.get("appID"),
      expirationDate: this.cookieService.get("expiration"),
      userInfo: JSON.parse(this.cookieService.get("userInfo")),
      userGroup: JSON.parse(this.cookieService.get("userGroup")),
    };
  }

  logout() {
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  updateUser(userInfo) {
    this.profileListener.next(true);
    this.http.patch(`${this.url}auth/update-user/`, userInfo).subscribe(
      (response: any) => {
        this.userInfo = this.helperService.getUserInfo();
        this.userInfo.first_name = response.first_name;
        this.userInfo.image = response.image;
        this.userInfo.last_name = response.last_name;
        this.cookieService.put(`userInfo`, JSON.stringify(this.userInfo));
        this.profileListener.next(false);
        this.notificationService.success(`Profile update`, `success`);
      },
      (err) => {
        this.profileListener.next(false);
      }
    );
  }

  changePassword(passwordData) {
    this.profileListener.next(true);
    this.http.put(`${this.url}auth/update-password/`, passwordData).subscribe(
      (response) => {
        this.profileListener.next(false);
        this.logout();
        this.notificationService.success(`Password change`, `success`);
      },
      (err) => {
        const errorMessage =
          err.error.message ||
          err.error.details ||
          err.error.error ||
          err.error;
        this.notificationService.danger(`Password change`, errorMessage);
        this.profileListener.next(false);
        this.errorService.handleError(errorMessage);
      }
    );
  }

  forgotPassword(emailPayload) {
    this.isLoadingListener.next(true);
    localStorage.setItem("emailPayload", JSON.stringify(emailPayload));
    this.http
      .post(`${this.url}auth/reset-password-email/`, emailPayload)
      .subscribe(
        (response: any) => {
          this.isLoadingListener.next(false);
          this.notificationService.success(`Successful`, `${response.message}`);
          this.router.navigate(["/auth/email-sent"]);
        },
        (err) => {
          this.isLoadingListener.next(false);
          const erroMessage = err.error.detail || err.error.message;
          this.notificationService.danger(`Error`, erroMessage);
        }
      );
    //
  }

  verifyOTP(otpPayload) {
    this.isLoadingListener.next(true);
    this.http.post(`${this.url}auth/confirm-token/`, otpPayload).subscribe(
      (response: any) => {
        this.accessToken = response.access;
        this.refreshToken = response.refresh;
        this.cookieService.put(`token`, this.accessToken);
        this.cookieService.put(`refresh`, this.refreshToken);
        this.notificationService.success(`Successful`, response.message);
        this.isLoadingListener.next(false);
        this.router.navigate(["/auth/reset-password"]);
      },
      (err) => {
        this.isLoadingListener.next(false);
        const erroMessage = err.error.detail || err.error.message;
        this.notificationService.danger(`Error`, erroMessage);
      }
    );
  }

  passwordReset(passwordPayload) {
    this.isLoadingListener.next(true);
    this.http
      .post(`${this.url}auth/reset-password/`, passwordPayload)
      .subscribe(
        (response: any) => {
          this.isLoadingListener.next(false);
          if (response.code == 200) {
            this.accessToken = response.access;
            this.refreshToken = response.refresh;
            this.cookieService.put(`token`, this.accessToken);
            this.cookieService.put(`refresh`, this.refreshToken);
            this.notificationService.success(`Successful`, response.message);
            this.router.navigate(["/"]);
          }
        },
        (err) => {
          this.isLoadingListener.next(false);
          this.notificationService.danger(`Error`, err.error.detail);
        }
      );
  }
}
