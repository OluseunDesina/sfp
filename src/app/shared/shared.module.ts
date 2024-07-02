import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from "ngx-toastr";

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ContentLayoutComponent } from './components/layout/content-layout/content-layout.component';
import { FeatherIconsComponent } from './components/feather-icons/feather-icons.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

// services
import { NavService } from "./services/nav.service";

// Directives
import { ToggleFullscreenDirective } from "./directives/fullscreen.directive";
import { CalendarDialogComponent } from './calendar-dialog/calendar-dialog.component';

// Modules
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import { ImagePipe } from './pipes/image.pipe';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TableFunctionsComponent } from './components/table-functions/table-functions.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PlatformPipe } from './pipes/platform.pipe';
import { TransactionStatusPipe } from './pipes/transaction-status.pipe';
import { MatInputModule } from '@angular/material/input';
import { DateTimePipe } from './pipes/date-time.pipe';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NoInternetComponent } from './components/no-internet/no-internet.component';
import { ReviewDialogComponent } from './components/review-dialog/review-dialog.component';
import { StarComponentComponent } from './components/star-component/star-component.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContentLayoutComponent,
    FeatherIconsComponent,
    BreadcrumbComponent,
    ToggleFullscreenDirective,
    CalendarDialogComponent,
    ImagePipe,
    PaginatorComponent,
    TableFunctionsComponent,
    PlatformPipe,
    TransactionStatusPipe,
    DateTimePipe,
    ConfirmDialogComponent,
    NoInternetComponent,
    ReviewDialogComponent,
    StarComponentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule
  ],
  exports: [
    FeatherIconsComponent,
    StarComponentComponent,
    FooterComponent,
    CalendarDialogComponent,
    PaginatorComponent,
    ImagePipe,
    PlatformPipe,
    TransactionStatusPipe,
    MatDatepickerModule,
    TableFunctionsComponent,
    DateTimePipe
  ],
  providers: [
    NavService
  ]
})
export class SharedModule { }

