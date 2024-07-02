import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { BankService } from "../../../shared/services/bank.service";
import { NotificationService } from "../../../shared/services/notification.service";
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from "ngx-intl-tel-input";
import { HelperService } from "src/app/shared/services/helper.service";
import { MatStepper } from "@angular/material/stepper";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { UserService } from "../../user.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { FindValueSubscriber } from "rxjs/internal/operators/find";

@Component({
  selector: "app-company-create",
  templateUrl: "./company-create.component.html",
  styleUrls: ["./company-create.component.scss"],
})
export class CompanyCreateComponent implements OnInit {
  title = "create school";
  contactForm: FormGroup = new FormGroup({});
  companyForm: FormGroup = new FormGroup({});
  billingForm: FormGroup = new FormGroup({});
  othersForm: FormGroup = new FormGroup({});
  passwordForm: FormGroup = new FormGroup({});
  bankList: any[] = [];
  private namePattern = "[a-zA-Z][a-zA-Z ]+[a-zA-Z]$";
  private emailRegEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])([ A-Za-z0-9_@./#&+-]+)$/;
  private numberRegex = /\d+/g;
  hide = true;
  biometricTypeArray: any[] = ["facial", "fingerprint"];
  topUpTypeArray: any[] = ["prepaid", "postpaid"];

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  mode: string;
  isLoading: boolean;

  constructor(
    private bankService: BankService,
    private fb: FormBuilder,
    private userService: UserService,
    private helperService: HelperService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userService.getIsLoadingListener().subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.contactForm = this.fb.group({
      contact_first_name: [
        "",
        [Validators.required, Validators.pattern(this.namePattern)],
      ],
      contact_last_name: [
        "",
        [Validators.required, Validators.pattern(this.namePattern)],
      ],
      contact_email: [
        "",
        [Validators.required, Validators.pattern(this.emailRegEx)],
      ],
      contact_phone_number: ["", [Validators.required]],
    });
    this.companyForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(this.namePattern)]],
      description: ["", [Validators.required]],
      private_key: ["", [Validators.required]],
      public_key: ["", [Validators.required]],
      sector: ["", [Validators.required]],
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
      service_fee: ["", [Validators.pattern(this.numberRegex)]],
      top_up_type: [""],
    });
    this.othersForm = this.fb.group({
      use_card: [false, []],
      use_biometric: [false, []],
      use_transaction_code: [false, []],
      allow_same_day_delivery: [false, []],
      allowed_booking_day: ["", [Validators.required]],
      is_comp_allow_txn_mix: [false],
      cash_out_time: [],
      cancelling_grace_period_in_hours: [],
      biometric_type: [""],
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
    this.checkMode();

    this.bankService.getPayStackBankList().subscribe((banks) => {
      this.bankList = banks;
    });
  }

  checkMode() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.mode = "edit";
        this.title = "edit school";
        // Get single Company
        // Populate Form
        return;
      }
      this.mode = "create";
      this.title = "create school";
    });
  }

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
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
      // open step 5
      stepper.selectedIndex = 4;
    } else {
      let phone_number =
        this.contactForm.value.contact_phone_number.number ||
        this.contactForm.value.contact_phone_number.phone;
      let contactForm = this.contactForm.value;
      contactForm.contact_phone_number = phone_number;
      this.isLoading = true;
      this.userService.createCompany({
        ...this.contactForm.value,
        ...this.companyForm.value,
        ...this.billingForm.value,
        ...this.othersForm.value,
        ...this.passwordForm.value,
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
