import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { ProfileService } from "src/app/shared/services/profile.service";
import { TransactionService } from "src/app/transactions/transaction.service";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  userInfo;
  passwordForm: FormGroup;
  userForm: FormGroup;
  private passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])([ A-Za-z0-9_@./#&+-]+)$/;
  isLoading: boolean = false;
  isStaff: boolean;
  isVend: boolean;
  cashingOut: boolean;
  profileSubb: Subscription;
  cash_out_amount: string = ""
  paytackBalance: number = 0;
  // changingPassword: boolean = false

  constructor(
    private helperService: HelperService,
    private authService: AuthService,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.authService.getProfileListener().subscribe((isLoading) => {
      this.isLoading = isLoading;
      isLoading ? null : this.getUserInfo();
    });
    this.getUserInfo();

    this.getuserGroup();

    this.getPaystackBalance()
  }

  ngOnDestroy(): void {
    this.profileSubb.unsubscribe();
  }

  onCashout(userInfo) {
    this.cashingOut = true;
    const cashoutAmount: number = Number(this.cash_out_amount.slice(1).replace(",", ""))
    if (!this.cash_out_amount) {
      this.cashingOut = false;
      // alert amount cannot be empty
      alert("cashout amount cannot be empty")
      return
    }
    if (cashoutAmount > Number(userInfo?.personal_balance)|| (cashoutAmount > Number(this.paytackBalance)) ) {
      this.cashingOut = false;
      alert("cashout amount cannot exeed available balance")
      // alert cashout amount cannot exeed available balance
      return
    }
    this.transactionService.cashout(null, cashoutAmount)
    .subscribe((response) => {
      this.cash_out_amount = "";
      this.getUserInfo()
      this.cashingOut = response;
    })
  }

  getDisable(userInfo):Boolean {
    const cashoutAmount: number = Number(this.cash_out_amount.slice(1).replace(",", ""))
    return !this.cash_out_amount || this.cashingOut || (cashoutAmount > Number(userInfo?.personal_balance));
  }

  getPaystackBalance() {
    this.transactionService.getPaystackBalance()
    .subscribe((response) => {
      this.paytackBalance = response.data.data[0].balance;
    })
  }

  readUrl(event) {
    this.isLoading = true;
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    let imagePreview;
    reader.onload = () => {
      imagePreview = reader.result as string;
      this.authService.updateUser({ image: imagePreview });
    };
    reader.readAsDataURL(file);
  }

  testUrl(event) {
    this.isLoading = true;
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    let imagePreview;
    let images: any[] = [];
    reader.onload = () => {
      // imagePreview = reader.result as string;
      // images.push(file);
      // images.push(file);
      // this.authService.test({ images, category: 1 });
    };
    reader.readAsDataURL(file);
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "emp":
        this.isStaff = true;
        break;
      case "ven":
        this.isVend = true;
        // this.getCompanyArray()
        break;
        // case 'sid':
        //   this.isSid = true;
        //   break;
        // case 'comp':
        //   this.isComp = true;
        break;

      default:
        break;
    }
  }

  get first_name() {
    return this.userForm.get(`first_name`);
  }

  get last_name() {
    return this.userForm.get(`last_name`);
  }

  get old_password() {
    return this.passwordForm.get(`old_password`);
  }

  get new_password() {
    return this.passwordForm.get(`new_password`);
  }

  getUserInfo() {
    this.profileSubb = this.profileService
      .getUSerInfo()
      .subscribe((userInfo) => {
        this.userInfo = userInfo;
        this.userForm = this.fb.group({
          first_name: [this.userInfo?.first_name, Validators.required],
          last_name: [this.userInfo?.last_name, Validators.required],
        });

        this.passwordForm = this.fb.group(
          {
            old_password: ["", Validators.required],
            new_password: [
              "",
              [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(this.passwordRegex),
              ],
            ],
            confirm_password: ["", Validators.required],
          },
          {
            validators: passwordMatch,
          }
        );
      });
  }

  updateUser() {
    this.isLoading = true;
    if (this.userForm.invalid) {
      this.helperService.validateAllFormFields(this.userForm);
      this.isLoading = false;
      return;
    }
    this.authService.updateUser(this.userForm.value);
  }

  changePassword() {
    this.isLoading = true;
    if (this.passwordForm.invalid) {
      this.helperService.validateAllFormFields(this.passwordForm);
      this.isLoading = false;
      return;
    }
    this.authService.changePassword({
      old_password: this.passwordForm.value.old_password,
      new_password: this.passwordForm.value.new_password,
    });
  }
}

function passwordMatch(formGroup: FormGroup): ValidationErrors | undefined {
  const passwordControl = formGroup.get("new_password");
  const confirmPasswordControl = formGroup.get("confirm_password");

  if (passwordControl.value === confirmPasswordControl.value) {
    return null;
  } else {
    return {
      passwordMatch: true,
    };
  }
}
