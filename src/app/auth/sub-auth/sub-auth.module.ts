import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { EmailSentComponent } from "./email-sent/email-sent.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ConsentAgreementComponent } from "./consent-agreement/consent-agreement.component";
import { SubAuthRoutingModule } from "./sub-auth.routing.module";
import { LandingModule } from "src/app/landing/landing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { NgOtpInputModule } from "ng-otp-input";

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    ResetPasswordComponent,
    EmailSentComponent,
    ConsentAgreementComponent,
  ],
  imports: [
    CommonModule,
    SubAuthRoutingModule,
    LandingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgOtpInputModule,
  ],
})
export class SubAuthModule {}
