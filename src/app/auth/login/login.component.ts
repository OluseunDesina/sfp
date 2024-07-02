import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../auth.service";
import { HelperService } from "../../shared/services/helper.service";
import { ErrorService } from 'src/app/shared/services/error.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading: boolean = false;
  loginForm: FormGroup;
  errorMessage: string;
  private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private helperService: HelperService,
    private errorService: ErrorService,
    private loginDialogRef: MatDialogRef<LoginComponent>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.errorService.getErrorListener()
    .subscribe((errorMessage) => {
      this.errorMessage = errorMessage;
    })
    this.authService.getIsLoadingListener().subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ["", [Validators.required]],
    });
  }

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
  }

  onLogin() {
    this.errorMessage = null
    this.isLoading = true
    if (this.loginForm.invalid) {
      this.helperService.validateAllFormFields(this.loginForm)
      this.isLoading = false
      return;
    }
    this.authService.login(this.loginForm.value, this.loginDialogRef);
  }

  forgotPassword() {
    this.router.navigate(["/auth/forgot-password"])
    this.loginDialogRef.close()
  }

}
