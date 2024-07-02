import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ContentLayoutComponent } from "./shared/components/layout/content-layout/content-layout.component";
import { content } from "./shared/routes/content-routes";

const routes: Routes = [

  {
    path: "",
    loadChildren: () =>
      import("./landing/landing.module").then((m) => m.LandingModule),
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },

  {
    path: "",
    component: ContentLayoutComponent,
    children: content,
  },
  {
    path: "**",
    redirectTo: "/404",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      relativeLinkResolution: "legacy",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
