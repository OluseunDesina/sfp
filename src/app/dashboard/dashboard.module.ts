import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CountToModule } from 'angular-count-to';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    // FormsModule,
    CarouselModule,
    // NgbModule,
    // ChartistModule,
    ChartsModule,
    CountToModule,
    // DashboardRoutingModule,
    // NgxChartsModule,
    // Ng2GoogleChartsModule,
    // NgxDatatableModule
  ]
})
export class DashboardModule { }
