import { Routes } from "@angular/router";
import { NoInternetComponent } from "../components/no-internet/no-internet.component";

export const content: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("../../dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "profile",
    loadChildren: () =>
      import("../../profile/profile.module").then((m) => m.ProfileModule),
  },
  {
    path: "food",
    loadChildren: () =>
      import("../../food/food.module").then((m) => m.FoodModule),
  },
  {
    path: "user",
    loadChildren: () =>
      import("../../user/user.module").then((m) => m.UserModule),
  },
  {
    path: "transactions",
    loadChildren: () =>
      import("../../transactions/transactions.module").then(
        (m) => m.TransactionsModule
      ),
  },
  {
    path: "survey",
    loadChildren: () =>
      import("../../survey/survey.module").then(
        (m) => m.SurveyModule
      ),
  },
  {
    path: "devices",
    loadChildren: () =>
      import("../../device/device.module").then(
        (m) => m.DeviceModule
      ),
  },
  {
    path: "no-internet",
    component: NoInternetComponent,
  },
];
