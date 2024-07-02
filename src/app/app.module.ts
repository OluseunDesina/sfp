import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieModule } from 'ngx-cookie';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from "./shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';

import { AuthInterceptor } from "./auth/auth.interceptor";
import { AppIdInterceptor } from "./app-id.interceptor";
import { ToastrModule } from 'ngx-toastr';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Angular4PaystackModule } from 'angular4-paystack';

@NgModule({
  declarations: [
    AppComponent,

    // LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    MatNativeDateModule,
    CookieModule.forRoot(),
    ToastrModule.forRoot(),
    Angular4PaystackModule.forRoot('pk_test_1'),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AppIdInterceptor, multi: true },
    {
      provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true, displayDefaultIndicatorType: false}
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
