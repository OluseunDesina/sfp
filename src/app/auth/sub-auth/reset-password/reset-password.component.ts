import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { HelperService } from "src/app/shared/services/helper.service";
import { AuthService } from "../../auth.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  hide;
  form: FormGroup = new FormGroup({});
  isLoading: boolean;
  private passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.authService.getIsLoadingListener().subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.hide = true;
    this.form = this.fb.group(
      {
        password: [
          "",
          [Validators.required, Validators.pattern(this.passwordRegex)],
        ],
        confirm_password: ["", [Validators.required]],
      },
      {
        validators: passwordMatch,
      }
    );
  }

  get password() {
    return this.form.get("password");
  }

  get confirm_password() {
    return this.form.get("confirm_password");
  }

  onReset() {
    this.isLoading = true;
    if (this.form.invalid) {
      this.helperService.validateAllFormFields(this.form);
      this.isLoading = false;
      return;
    }
    this.authService.passwordReset(this.form.value);
  }
}

function passwordMatch(formGroup: FormGroup): ValidationErrors | undefined {
  const passwordControl = formGroup.get("password");
  const confirmPasswordControl = formGroup.get("confirm_password");

  if (passwordControl.value === confirmPasswordControl.value) {
    return null;
  } else {
    return {
      passwordMatch: true,
    };
  }
}
