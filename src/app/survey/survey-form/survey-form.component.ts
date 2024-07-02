import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { SurveyService } from "../../shared/services/survey.service";
import { Option, Question } from "../survey.model";
import { HelperService } from "src/app/shared/services/helper.service";

@Component({
  selector: "app-survey-form",
  templateUrl: "./survey-form.component.html",
  styleUrls: ["./survey-form.component.scss"],
})
export class SurveyFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  questionForm = new FormGroup({});
  optionForm = new FormGroup({});
  optionFormContent = {};

  questionTypes: any[] = [
    {
      viewValue: "Single answer",
      value: "SINGLE_ANSWER",
    },
    // {
    //   viewValue: "Check boxes",
    //   value: "MULTIPLE_ANSWER",
    // },
    // {
    //   viewValue: "Star rating",
    //   value: "STAR_RATING",
    // },
  ];
  isLoading: boolean = true;
  surveyList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private helperService: HelperService
    ) {}

  ngOnInit(): void {
    this.optionFormContent = {
      value: ["", [Validators.required]],
      key: ["", Validators.required],
    };
    this.optionForm = this.fb.group(this.optionFormContent);

    this.getQuestions();
  }

  getQuestions() {
    this.populateEmptyFormArray()
    // this.surveyService.getQuestions().subscribe((response: any) => {
    //   this.isLoading = false;
    //   this.surveyList = response.results;
    //   this.surveyList.length > 0
    //     ? this.populateFormArray(this.testData)
    //     : this.populateEmptyFormArray();
    // });
  }

  get questions() {
    return this.form.get("questions") as FormArray;
  }

  options(questionIndex): any {
    return (<any>this.form.get("questions")).controls[questionIndex].get(
      "options"
    ) as FormArray;
  }

  populateFormArray(data) {
    // this.form = this.fb.group({
    //   questions: this.fb.array(
    //     data.map((datum) => this.generateDatumFormGroup(datum))
    //   ),
    // });

    this.form = this.fb.group({
      questions: this.fb.array(
        data.map((datum) => {
          return this.fb.group({
            id: [datum.id, [Validators.required]],
            title: [datum.title, [Validators.required]],
            required: [datum.required, [Validators.required]],
            type: [datum.type, [Validators.required]],
            options: this.fb.array(this.populateOptions(datum.options)),
          });
        })
      ),
    });
  }

  populateOptions(options) {
    return options.map((option) => {
      return this.fb.group({
        key: [option.key, [Validators.required]],
        value: [option.value, [Validators.required]],
      });
    });
  }

  populateEmptyFormArray() {
    this.questionForm = this.fb.group({
      title: ["", [Validators.required]],
      // positions: [1, [Validators.required]],
      required: [false, [Validators.required]],
      type: [this.questionTypes[0].value, [Validators.required]],
      options: this.fb.array([
        this.fb.group(this.optionFormContent, [Validators.required]),
      ]),
    });
    this.form = this.fb.group({
      questions: this.fb.array([this.questionForm]),
    });
  }

  addOption(questionIndex) {
    this.options(questionIndex).push(this.fb.group(this.optionFormContent));
  }

  addQuestion() {
    const questionContent = this.fb.group({
      title: ["", [Validators.required]],
      // positions: [this.questions.length + 1, [Validators.required]],
      required: [false, [Validators.required]],
      type: [this.questionTypes[0].value, [Validators.required]],
      options: this.fb.array([
        this.fb.group(this.optionFormContent, [Validators.required]),
      ]),
    });
    this.questions.push(questionContent);
  }

  removeQuestion(questionIndex) {
    this.questions.removeAt(questionIndex);
  }

  removeOption(questionIndex, optionIndex) {
    this.options(questionIndex).removeAt(optionIndex);
  }

  setKey(questionIndex, optionIndex) {
    const option = this.options(questionIndex).controls[optionIndex];
    const oldOptionValue: Option = option.value;
    const newOptionValue: Option = {
      key: oldOptionValue.value,
      value: oldOptionValue.value,
    };
    option.patchValue(newOptionValue);
    option.updateValueAndValidity();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.questions.controls,
      event.previousIndex,
      event.currentIndex
    );
  }

  onSubmit() {
    let form: { questions: Question[] } | null;
    form = this.form.getRawValue();
    if (this.form.invalid) {
      this.helperService.validateAllFormFields(this.form)
      return;
    }
    form.questions = form.questions.map((element, index) => {
      return {
        ...element,
        position: index + 1,
      };
    });
    this.surveyService.submitQuestions(form);
  }
}
