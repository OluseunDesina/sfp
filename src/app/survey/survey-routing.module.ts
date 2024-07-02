import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyFormComponent } from './survey-form/survey-form.component';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { SurveyResponseStatComponent } from './survey-response-stat/survey-response-stat.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "survey-list",
    pathMatch: "full"
  },
  {
    path: "survey-form",
    component: SurveyFormComponent
  },
  {
    path: "survey-list",
    component: SurveyListComponent
  },
  {
    path: "survey-response-stat",
    component: SurveyResponseStatComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
