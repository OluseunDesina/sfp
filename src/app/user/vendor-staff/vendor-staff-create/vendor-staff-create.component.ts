import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { BankService } from 'src/app/shared/services/bank.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { UserService } from '../../user.service';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from "ngx-intl-tel-input";

import { passwordMatch } from "../../company/company-create/company-create.component";
import { ErrorService } from 'src/app/shared/services/error.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-vendor-staff-create',
  templateUrl: './vendor-staff-create.component.html',
  styleUrls: ['./vendor-staff-create.component.scss']
})
export class VendorStaffCreateComponent implements OnInit {
  title = "create vendor staff";
  contactForm: FormGroup = new FormGroup({});
  companyForm: FormGroup = new FormGroup({});
  billingForm: FormGroup = new FormGroup({});
  othersForm: FormGroup = new FormGroup({});
  // passwordForm: FormGroup = new FormGroup({});
  bankList: any[] = [];
  hide = true;

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
  isLoading: boolean;
  passwordForm: FormGroup;
  errorMessage: string;

  constructor(
    private bankService: BankService,
    private fb: FormBuilder,
    private userService: UserService,
    private helperService: HelperService,
    private errorService: ErrorService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.errorService.getErrorListener()
    .subscribe((errorMessage) => {
      this.errorMessage = errorMessage;
      this.isLoading = false
    })
    this.contactForm = this.fb.group({
      first_name: [
        "",
        [Validators.required, Validators.pattern(this.namePattern)],
      ],
      last_name: [
        "",
        [Validators.required, Validators.pattern(this.namePattern)],
      ],
      email: [
        "",
        [Validators.required, Validators.pattern(this.emailRegEx)],
      ],
      // phone_numnber: ["", [Validators.required]],
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
    // this.companyForm = this.fb.group({
    //   bussiness_name: ["", [Validators.required, Validators.pattern(this.namePattern)]],
    //   description: ["", [Validators.required]],
    // });
    // this.billingForm = this.fb.group({
    //   account_number: [
    //     "",
    //     [
    //       Validators.required,
    //       Validators.minLength(10),
    //       Validators.maxLength(10),
    //       Validators.pattern(this.numberRegex),
    //     ],
    //   ],
    //   bank_code: [null, [Validators.required]],
    // });
    // this.othersForm = this.fb.group({
    //   is_market_space: ["", [Validators.required]],
    //   is_company: ["", [Validators.required]],
    // });

    this.bankService.getPayStackBankList().subscribe((banks) => {
      this.bankList = banks;
    });
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
    }
    // else if (this.passwordForm.invalid) {
    //   this.validateForm(this.passwordForm);
    //   // open step 5
    //   stepper.selectedIndex = 4;
    // }
    else {
      this.isLoading = true;
    const appId = this.cookieService.get("appId");
    this.userService.createVendorStaff({
        ...this.contactForm.value,
        // ...this.companyForm.value,
        // ...this.billingForm.value,
        // ...this.othersForm.value,
        ...this.passwordForm.value,
        app_code: appId
      });
    }
  }

  validateForm(form) {
    this.helperService.validateAllFormFields(form);
  }
}


