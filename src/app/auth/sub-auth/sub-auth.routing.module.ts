import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConsentAgreementComponent } from "./consent-agreement/consent-agreement.component";
import { EmailSentComponent } from "./email-sent/email-sent.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

const routes: Routes = [
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "email-sent",
    component: EmailSentComponent,
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
  },
  {
    path: "consent-agreement",
    component: ConsentAgreementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubAuthRoutingModule {}
