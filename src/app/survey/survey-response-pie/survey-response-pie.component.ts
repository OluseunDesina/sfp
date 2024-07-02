import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { ChartOptions } from "chart.js";
import * as Chart from "chart.js";

@Component({
  selector: "app-survey-response-pie",
  templateUrl: "./survey-response-pie.component.html",
  styleUrls: ["./survey-response-pie.component.scss"],
})
export class SurveyResponsePieComponent implements OnChanges {

  @Input("pieChartLabels") pieChartLabels: any[] = [];
  @Input("pieChartDatasets") pieChartDatasets = [];
  @ViewChild('myChart1', { static: true }) myChart1: ElementRef<HTMLCanvasElement>

  constructor() {}

  ngOnChanges(): void {
    const canvas = this.myChart1.nativeElement;
    const ctx1 = canvas.getContext("2d");
    const data = {
      labels: this.pieChartLabels,
      datasets: [{
        data: this.pieChartDatasets,
        backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(205, 255, 85)',
                'rgb(255, 86, 205)',
              ],
        hoverOffset: 4
      }]
    };

    const options: ChartOptions = {
      legend: {
        display: true,
        labels: {
          fontColor: "rgb(255, 99, 132)",
        },
        position: "right",
        align: "start",
      },
    };
    const myDoughnutChart = new Chart(ctx1, {
      type: "pie",
      data: data,
      options: options,
    });
  }
}
