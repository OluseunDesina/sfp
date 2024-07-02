import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './sub-auth/forgot-password/forgot-password.component';

const routes: Routes = [
  {
  path: '',
  loadChildren: () => import('./sub-auth/sub-auth.module').then(m => m.SubAuthModule)
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
