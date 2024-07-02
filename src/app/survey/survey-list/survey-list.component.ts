import { Component, OnInit } from "@angular/core";
import { DialogService } from "src/app/shared/services/dialog.service";
import { SurveyService } from "src/app/shared/services/survey.service";

@Component({
  selector: "app-survey-list",
  templateUrl: "./survey-list.component.html",
  styleUrls: ["./survey-list.component.scss"],
})
export class SurveyListComponent implements OnInit {
  isLoading: boolean = true;
  surveyList: any[] = [];

  constructor(
    private surveyService: SurveyService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getQuestions();
  }

  getQuestions() {
    this.surveyService.getQuestions().subscribe((response: { data: any[] }) => {
      this.isLoading = false;
      const questions = response.data
        .filter((element: { options: any[] }) => {
          return element.options.length > 0;
        })
        .sort((a, b) => {
          return a.position - b.position;
        });
      this.surveyList = questions;
    });
  }

  deleteQuestion(question) {
    this.dialogService
      .openConfirmDialog(
        `Delete Question`,
        `Are you sure you want to delete Question?`
      )
      .afterClosed()
      .subscribe((response) => {
        response
          ? this.surveyService
              .deleteQuestion(question.id)
              .subscribe((response) => {
                this.getQuestions();
              })
          : null;
      });
  }
}
