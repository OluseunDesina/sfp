import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-email-sent',
  templateUrl: './email-sent.component.html',
  styleUrls: ['./email-sent.component.scss']
})
export class EmailSentComponent implements OnInit {
  emailPayload: any;
  isLoading: boolean;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getIsLoadingListener()
    .subscribe((isLoading) => {
      this.isLoading = isLoading
    })
    this.emailPayload = JSON.parse(localStorage.getItem("emailPayload"))
  }
  onResend() {
    this.authService.forgotPassword(this.emailPayload)
  }

  onOtpChange(value: string) {
    if (value.length != 6) {
      return
    }
    this.authService.verifyOTP({
      ...this.emailPayload, token: value
    })
  }

}
