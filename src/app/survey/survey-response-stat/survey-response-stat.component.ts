import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/services/helper.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-survey-response-stat',
  templateUrl: './survey-response-stat.component.html',
  styleUrls: ['./survey-response-stat.component.scss']
})
export class SurveyResponseStatComponent implements OnInit {

  isLoading: boolean = false;
  responseStat: any[] = [];
  vendorArray: { name: any; id: any; }[];
  private startDate: string;
  private endDate: string;
  vendor: any;

  constructor(
    private surveyService: SurveyService,
    private userService: UserService,
    private helperService: HelperService,
    ) { }

  ngOnInit(): void {
    this.getResponseStat();
    this.getVendorArray();
  }

  getVendorArray() {
    this.userService.getVendors();
    this.userService.getVendorsUpdate().subscribe((vendors) => {
      const venArray = vendors.results.map((element) => {
        return { name: element.bussiness_name, id: element.id };
      });
      this.vendorArray = [{ id: "", name: "All Vendors" }, ...venArray];
    });
  }

  getResponseStat() {
    const payload ={
      vendor: this.vendor,
      start_date: this.startDate,
      end_date: this.endDate,
    }
    this.surveyService.getResponseStats(payload)
    .subscribe((response: {data: any[]}) => {
      this.responseStat = response.data.map((element) => {
        return {
          ...element,
          labels: element.options.map((value) => {return value.option_value}),
          counts: element.options.map((value) => {return value.response_count}),
        }
      })
    })
  }

  getResponseSum(arr: number[]) {
    return arr.reduce((a, b) => a + b)
  }


  setStartDate(value) {
    this.startDate = this.helperService.formatDate(value.value);
  }

  setEndDate(value) {

    this.endDate = this.helperService.formatDate(value.value);
    this.getResponseStat();
  }

  vendorChange(value) {
    this.vendor = value;
    this.getResponseStat();
  }

}
