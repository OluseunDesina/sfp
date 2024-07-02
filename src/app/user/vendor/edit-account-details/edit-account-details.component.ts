import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BankService } from "src/app/shared/services/bank.service";
import { ErrorService } from "src/app/shared/services/error.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { UserService } from "../../user.service";

@Component({
  selector: "app-edit-account-details",
  templateUrl: "./edit-account-details.component.html",
  styleUrls: ["./edit-account-details.component.scss"],
})
export class EditAccountDetailsComponent implements OnInit {
  isLoading = false;

  title = "Create Device";
  acctInfoForm: FormGroup = new FormGroup({});
  errorMessage: string;
  bankList: any[] = [];
  private numberPattern = /\d+/g;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private errorService: ErrorService,
    private dialogRef: MatDialogRef<EditAccountDetailsComponent>,
    private bankService: BankService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.acctInfoForm = this.fb.group({
      id: [this.data.user.id, Validators.required],
      bank_code: ["", Validators.required],
      account_number: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(this.numberPattern),
        ],
      ],
    });
    this.errorService.getErrorListener().subscribe((errorMessage) => {
      this.errorMessage = errorMessage;
      this.isLoading = false;
    });
    this.getBankList();
  }
  get account_number() {
    return this.acctInfoForm.get("account_number")
  }

  get bank_code() {
    return this.acctInfoForm.get("bank_code")
  }

  getBankList() {
    this.bankService.getPayStackBankList().subscribe((banks) => {
      this.bankList = banks;
    });
  }

  onSave() {
    this.isLoading = true;
    if (this.acctInfoForm.invalid) {
      this.helperService.validateAllFormFields(this.acctInfoForm);
      this.isLoading = false;
      return;
    }
    this.userService.updateVendor(this.acctInfoForm.value).subscribe(
      () => {
        this.dialogRef.close();
      },
      (err) => {
        this.errorMessage = err.error.error;
      }
    );
  }
}
