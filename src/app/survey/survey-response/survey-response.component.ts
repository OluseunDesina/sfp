import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { shareReplay } from "rxjs/operators";
import { DashboardService } from "src/app/dashboard/dashboard.service";
import { HelperService } from "src/app/shared/services/helper.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { SurveyService } from "src/app/shared/services/survey.service";

@Component({
  selector: "app-survey-response",
  templateUrl: "./survey-response.component.html",
  styleUrls: ["./survey-response.component.scss"],
})
export class SurveyResponseComponent implements OnInit {
  rating: number = 0;
  review = "";
  form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<SurveyResponseComponent>,
    private helperService: HelperService,
    private notificationService: NotificationService,
    private dashboardService: DashboardService,
  ) { }

  ngOnInit(): void {
    this.getQuestions();
  }

  handleRating(event: number) {
    this.rating = event;
  }

  getQuestions() {
    this.surveyService.getQuestions().subscribe((response: { data: any[]; }) => {
      let questions = response.data.filter((element: { options: any[]; }) => {
        return element.options.length > 0;
      });

      questions.length > 0 ? questions = questions.sort((a, b) => {
        return a.position - b.position;
      }) : null;
      this.populateForm(questions);
    });
  }

  get questions() {
    return this.form.get("responses") as FormArray;
  }

  populateForm(array: any[]) {
    this.form = this.fb.group({
      responses: this.fb.array(
        array.map((element) => {
          return this.fb.group({
            transaction: [this.data.id],
            question: [element.id],
            title: [element.title],
            options: [element.options],
            // selected_options: this.fb.array([this.fb.control("", [Validators.required])]),
            selected_options: ["", Validators.required],
          });
        })
      ),
    });
  }

  onSubmit() {
    const reviewData = {
      rating: this.rating,
      review: this.review,
      transaction: this.data.id
    };

    if (this.form.invalid) {
      this.notificationService.danger("Error", "One or more of the response is missing");
      this.helperService.validateAllFormFields(this.form);
      return;
    }

    if (!this.review) {
      this.notificationService.danger("Error", "you need to leave a review");
      return;
    }
    if (this.rating < 1) {
      this.notificationService.danger("Error", "you need to leave a rating");
      return;
    }
    this.surveyService.submitResponse(this.form.getRawValue())
      .subscribe((res) => {
        this.notificationService.info(`Thank you`, "Your response has been recorded.");
        this.dialogRef.close();
      }, (err) => {
        this.notificationService.danger("Error", err.error.message);
      });

    this.dashboardService.rateVendor(reviewData)
      .pipe(
        shareReplay(1)
      ).subscribe(() => {
        this.dialogRef.close();
      }, (err) => {
        this.notificationService.danger("Error", err.error.message);
      });
  }
}
