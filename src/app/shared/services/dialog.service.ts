import { Injectable } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import { ReviewDialogComponent } from '../components/review-dialog/review-dialog.component';
import { SurveyResponseComponent } from 'src/app/survey/survey-response/survey-response.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }


  openConfirmDialog(title = "Are you sure?", message = "You won't be able to revert this!") {
    return this.dialog.open(ConfirmDialogComponent, {
      // width: "450px",
      // panelClass: "confirm-dialog-container",
      disableClose: true,
      // position: { top: "10px" },
      data: {
        title: title,
        message: message,
      },
    });
  }

  reviewDialog(data) {
    return this.dialog.open(ReviewDialogComponent, {
      data: data,
      width: "450px",
      disableClose: true,
    })
  }

  surveyDialog(data, config: any = {disableClose: false}) {
    return this.dialog.open(SurveyResponseComponent, {
      data: data,
      width: "80%",
      maxHeight: "90%",
      panelClass: "login-dialog",
      ...config,
      // disableClose: true
    })
  }
}
