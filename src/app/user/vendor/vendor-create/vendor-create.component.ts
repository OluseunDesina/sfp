import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { BankService } from "src/app/shared/services/bank.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "../../user.service";
import { MatStepper } from "@angular/material/stepper";
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from "ngx-intl-tel-input";
import { ErrorService } from "src/app/shared/services/error.service";

@Component({
  selector: "app-vendor-create",
  templateUrl: "./vendor-create.component.html",
  styleUrls: ["./vendor-create.component.scss"],
})
export class VendorCreateComponent implements OnInit {
  title = "create vendor ";
  contactForm: FormGroup = new FormGroup({});
  companyForm: FormGroup = new FormGroup({});
  billingForm: FormGroup = new FormGroup({});
  othersForm: FormGroup = new FormGroup({});
  passwordForm: FormGroup = new FormGroup({});
  bankList: any[] = [];
  hide;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];

  private namePattern = "[a-zA-Z][a-zA-Z ]+[a-zA-Z]$";
  private emailRegEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])([ A-Za-z0-9_@./#&+-]+)$/;
  private numberRegex = /\d+/g;
  isComp: boolean;
  isSid: boolean;
  companyList: any[];
  isLoading: boolean;
  errorMessage: string;

  constructor(
    private bankService: BankService,
    private fb: FormBuilder,
    private userService: UserService,
    private helperService: HelperService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.errorService.getErrorListener().subscribe((errorMessage) => {
      this.errorMessage = errorMessage;
      this.isLoading = false;
    });
    this.contactForm = this.fb.group({
      username: [
        "",
        [Validators.required, Validators.pattern(this.namePattern)],
      ],
      first_name: [
        "",
        [Validators.required, Validators.pattern(this.namePattern)],
      ],
      last_name: [
        "",
        [Validators.required, Validators.pattern(this.namePattern)],
      ],
      email: ["", [Validators.required, Validators.pattern(this.emailRegEx)]],
      phone_number: ["", [Validators.required]],
    });

    this.companyForm = this.fb.group({
      bussiness_name: [
        "",
        [Validators.required, Validators.pattern(this.namePattern)],
      ],
      description: ["", [Validators.required]],
      // company: [0, []],
    });

    this.billingForm = this.fb.group({
      account_number: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(this.numberRegex),
        ],
      ],
      bank_code: [null, [Validators.required]],
    });

    this.othersForm = this.fb.group({
      is_market_space: [false],
      is_company: [false],
    });

    this.passwordForm = this.fb.group(
      {
        password: [
          "",
          [
            Validators.required,
            Validators.pattern(this.passwordRegex),
            Validators.minLength(8),
          ],
        ],
        confirmPassword: [
          "",
          [Validators.required, Validators.pattern(this.passwordRegex)],
        ],
      },
      {
        validator: passwordMatch,
      }
    );

    this.bankService.getPayStackBankList().subscribe((banks) => {
      this.bankList = banks;
    });

    this.getuserGroup();
  }

  getuserGroup() {
    const userGroup = this.helperService.getUserGroup();
    switch (userGroup) {
      case "cmp_adm":
        this.isComp = true;
        const user = this.helperService.getUserInfo();
        break;
      case "sid":
        this.isSid = true;
        this.getCompanyList();
        // this.companyForm.get("company").setValidators([Validators.required]);
        // this.companyForm.get("company").updateValueAndValidity();
        break;

      default:
        break;
    }
  }

  getCompanyList() {
    this.userService.getCompanyList();
    this.userService.getCompanyListUpdate().subscribe((companyList) => {
      this.companyList = companyList.results.map((element, index) => {
        return { ...element, position: index + 1 };
      });
    });
  }

  setPhone(value) {
    let phone_number = this.contactForm.get("phone_number");
    phone_number.patchValue(value.target.value);
    phone_number.updateValueAndValidity();
  }

  onSave(stepper: MatStepper) {
    if (this.contactForm.invalid) {
      this.validateForm(this.contactForm);
      // open step 1
      stepper.selectedIndex = 0;
    } else if (this.companyForm.invalid) {
      this.validateForm(this.companyForm);
      // open step 2
      stepper.selectedIndex = 1;
    } else if (this.billingForm.invalid) {
      this.validateForm(this.billingForm);
      // open step 3
      stepper.selectedIndex = 2;
    } else if (this.othersForm.invalid) {
      this.validateForm(this.othersForm);
      // open step 4
      stepper.selectedIndex = 3;
    } else if (this.passwordForm.invalid) {
      this.validateForm(this.passwordForm);
      // open step 4
      stepper.selectedIndex = 4;
    } else {
      this.isLoading = true;

      this.userService.createVendor({
        user: { ...this.contactForm.value, ...this.passwordForm.value },
        ...this.companyForm.value,
        ...this.billingForm.value,
        ...this.othersForm.value,
      });
    }
  }

  validateForm(form) {
    this.helperService.validateAllFormFields(form);
  }
}

export function passwordMatch(
  formGroup: FormGroup
): ValidationErrors | undefined {
  const passwordControl = formGroup.get("password");
  const confirmPasswordControl = formGroup.get("confirmPassword");

  if (passwordControl.value === confirmPasswordControl.value) {
    return null;
  } else {
    return {
      passwordMatch: true,
    };
  }
}
