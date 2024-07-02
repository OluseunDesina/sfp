import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { HelperService } from "src/app/shared/services/helper.service";
import { AuthService } from "../../auth.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  hide;
  private emailRegEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isLoading: boolean;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private helperService: HelperService) {}

  ngOnInit(): void {
    this.authService.getIsLoadingListener()
    .subscribe((isLoading) => {
      this.isLoading = isLoading
    })
    this.hide = false;
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email, Validators.pattern(this.emailRegEx)]],
    });
  }

  get email() {
    return this.form.get("email");
  }

  onForgotPassword() {
    this.isLoading = true
    if (this.form.invalid) {
      this.isLoading = false
      this.helperService.validateAllFormFields(this.form)
      return;
    }

    this.authService.forgotPassword(this.form.value)
  }
}
