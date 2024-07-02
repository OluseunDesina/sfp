import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompanyWithdrawalHistoryComponent } from "./company-withdrawal-history/company-withdrawal-history.component";
import { OrderHistoryComponent } from "./order-history/order-history.component";
import { SidWithdrawalHistoryComponent } from "./sid-withdrawal-history/sid-withdrawal-history.component";
import { TopUpHistoryComponent } from "./top-up-history/top-up-history.component";
import { TopupPersonalComponent } from "./topup-personal/topup-personal.component";
import { TotalCostComponent } from "./total-cost/total-cost.component";
import { VendorWithdrawalHistoryComponent } from "./vendor-withdrawal-history/vendor-withdrawal-history.component";
import { VoidTransactionsComponent } from "./void-transactions/void-transactions.component";

const routes: Routes = [
  {
    path: "order-history",
    component: OrderHistoryComponent,
  },
  {
    path: "total-cost",
    component: TotalCostComponent,
  },
  {
    path: "company-withdrawal-history",
    component: CompanyWithdrawalHistoryComponent,
  },
  {
    path: "vendor-withdrawal-history",
    component: VendorWithdrawalHistoryComponent,
  },
  {
    path: "sid-withdrawal-history",
    component: SidWithdrawalHistoryComponent,
  },
  {
    path: "voided-transactions",
    component: VoidTransactionsComponent,
  },
  {
    path: "topup-history",
    component: TopUpHistoryComponent,
  },
  {
    path: "topup-personal",
    component: TopupPersonalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
