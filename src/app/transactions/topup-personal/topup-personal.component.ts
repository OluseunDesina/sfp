import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
// import { PaystackOptions } from "angular4-paystack";
import { HelperService } from "src/app/shared/services/helper.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { TransactionService } from "../transaction.service";

@Component({
  selector: "app-topup-personal",
  templateUrl: "./topup-personal.component.html",
  styleUrls: ["./topup-personal.component.scss"],
})
export class TopupPersonalComponent implements OnInit, AfterViewInit {
  title: string | number;
  reference = "";
  amount: number;
  userInfo: any;
  // options: PaystackOptions;
  @ViewChild("paystackButton", { static: false }) paystackButton: ElementRef;

  constructor(
    private helperService: HelperService,
    private notificationService: NotificationService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.userInfo = this.helperService.getUserInfo();
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.userInfo = this.helperService.getUserInfo();
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
  }

  initiateTopUp() {
    // this.transactionService.getReference().subscribe((reference) => {
    //   this.reference = reference;
    //   const options: PaystackOptions = {
    //     ref: this.reference,
    //     amount: this.amount * 100,
    //     email: this.userInfo.email,
    //     key: this.userInfo.public_key,
    //     channels: ["card"],
    //   };
    //   this.options = options;
    //   this.paystackButton.nativeElement.click();
    // });
  }

  paymentInit() {}

  paymentDone(ref: any) {
    this.title = "Payment successfull";
    this.notificationService.info("Payment", "Payment was successful");
  }

  paymentCancel() {}
}
