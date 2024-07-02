import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LandingRoutingModule } from "./landing-routing.module";
import { LandingComponent } from "./landing.component";
import { MatDialogModule } from "@angular/material/dialog";
import { AuthNavbarComponent } from "./auth-navbar/auth-navbar.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { FaqComponent } from './faq/faq.component';
import { TermConditionComponent } from './term-condition/term-condition.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [LandingComponent, AuthNavbarComponent, FaqComponent, TermConditionComponent, PrivacyPolicyComponent],
  imports: [
    CommonModule,
    LandingRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  exports: [AuthNavbarComponent],
})
export class LandingModule {}
