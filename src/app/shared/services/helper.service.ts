import { Injectable } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { CookieService } from "ngx-cookie";
import * as moment from "moment";
import { AngularCsv } from "angular-csv-ext/dist/Angular-csv";
import { BehaviorSubject } from "rxjs";
import { NotificationService } from "./notification.service";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";

@Injectable({
  providedIn: "root",
})
export class HelperService {
  showCart: boolean = false;
  showCart$ = new BehaviorSubject<boolean>(this.showCart);


  constructor(
    private notificationService: NotificationService,
    private cookieService: CookieService,
    private breakpointObserver: BreakpointObserver
  ) { }

  toggleCart() {
    this.showCart = !this.showCart;
    this.showCart$.next(this.showCart);
  }

  getScreenSize() {
    // detect screen size changes
    return this.breakpointObserver.observe(["(max-width: 768px)"]);
  }

  formatDate(value) {
    let date = new Date(value);
    let startDate = `${date.getFullYear()}-${date.getMonth() + 1
      }-${date.getDate()}`;
    return startDate;
  }

  formatDateFromNow(date, time) {
    return moment(`${date} ${time}`).fromNow();
  }

  exportExcel(data, filename, tableHeaders) {
    let options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
      showTitle: true,
      useBom: true,
      noDownload: false,
      headers: tableHeaders,
      title: filename,
      useHeader: false,
      nullToEmptyString: true,
    };
    new AngularCsv(data, filename, options);
  }

  // exportPDF(data, title, tableHeaders) {
  //   let doc = new jsPDF();

  //   doc.setFontSize(18);
  //   doc.text(title, 11, 8);
  //   doc.setFontSize(11);
  //   doc.setTextColor(100);

  //   (doc as any).autoTable({
  //     head: tableHeaders,
  //     body: data,
  //     theme: "plain",
  //     didDrawCell: (data) => {
  //     },
  //   });

  //   // below line for Open PDF document in new tab
  //   doc.output("dataurlnewwindow");

  //   // below line for Download PDF document
  //   doc.save(`${title}.pdf`);
  // }

  lowerCase(string: string) {
    return string.toLowerCase().trim();
  }

  firstUpper(string: string) {
    const username = string.toLowerCase();
    return `${username.charAt(0).toUpperCase()}${username.slice(1)}`;
  }

  upperCase(string: string) {
    return string.toUpperCase();
  }

  validateAllFormFields(formGroup: FormGroup) {
    //{1}
    Object.keys(formGroup.controls).forEach((field) => {
      //{2}
      const control = formGroup.get(field); //{3}
      if (control instanceof FormControl) {
        //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        //{5}
        this.validateAllFormFields(control); //{6}
      } else if(control instanceof FormArray) {
        for (let index = 0; index < control.controls.length; index++) {
          const element: any = control.controls[index];
          this.validateAllFormFields(element)
        }
      }
    });
  }

  getUserGroup() {
    return JSON.parse(this.cookieService.get("userGroup"));
  }

  getUserInfo() {
    return JSON.parse(this.cookieService.get("userInfo"));
  }

  copyToClipboard(value) {

    navigator.clipboard.writeText(value);

    /* Alert the copied text */
    this.notificationService.info(`Copied`, `text copied to clipboard`)
  }
}
