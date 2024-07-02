import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { AuthRoutingModule } from './auth.routing.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    // FormsModule,
    AuthRoutingModule
  ],
  exports: [
    LoginComponent
  ]
})
export class AuthModule { }
