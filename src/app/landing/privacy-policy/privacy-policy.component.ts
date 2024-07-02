import { Component, ElementRef, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
  }

  onCopy(value) {
    /* Get the text field */
    this.helperService.copyToClipboard(value?.textContent);
  }

}
