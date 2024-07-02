import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyRoutingModule } from './survey-routing.module';
import { SurveyFormComponent } from './survey-form/survey-form.component';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SurveyResponseComponent } from './survey-response/survey-response.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import { SurveyResponseStatComponent } from './survey-response-stat/survey-response-stat.component';
import { SurveyResponsePieComponent } from './survey-response-pie/survey-response-pie.component';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SurveyFormComponent,
    SurveyListComponent,
    SurveyResponseComponent,
    SurveyResponseStatComponent,
    SurveyResponsePieComponent
  ],
  imports: [
    CommonModule,
    SurveyRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
    MatDialogModule,
    ChartsModule,
    MatRadioModule,
    SharedModule
  ]
})
export class SurveyModule { }
