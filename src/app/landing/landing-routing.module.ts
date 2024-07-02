import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { LandingComponent } from './landing.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermConditionComponent } from './term-condition/term-condition.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: "faq",
    component: FaqComponent
  },
  {
    path: "privacy-policy",
    component: PrivacyPolicyComponent
  },
  {
    path: "terms-condition",
    component: TermConditionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
