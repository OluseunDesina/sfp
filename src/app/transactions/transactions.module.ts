import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { CompanyWithdrawalHistoryComponent } from './company-withdrawal-history/company-withdrawal-history.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VendorWithdrawalHistoryComponent } from './vendor-withdrawal-history/vendor-withdrawal-history.component';
import { SidWithdrawalHistoryComponent } from './sid-withdrawal-history/sid-withdrawal-history.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { TopUpHistoryComponent } from './top-up-history/top-up-history.component';
import { VoidTransactionsComponent } from './void-transactions/void-transactions.component';
import { TopupPersonalComponent } from './topup-personal/topup-personal.component';
// import { Angular4PaystackModule } from 'angular4-paystack';
import { TotalCostComponent } from './total-cost/total-cost.component';

@NgModule({
  declarations: [
    CompanyWithdrawalHistoryComponent,
    VendorWithdrawalHistoryComponent,
    SidWithdrawalHistoryComponent,
    OrderHistoryComponent,
    TopUpHistoryComponent,
    VoidTransactionsComponent,
    TopupPersonalComponent,
    TotalCostComponent
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    // Angular4PaystackModule,
  ]
})
export class TransactionsModule { }
