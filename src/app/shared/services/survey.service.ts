import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private url = environment.url;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private router: Router
    ) { }

  submitQuestions(questions) {
    this.http.post(`${this.url}txn/review-questions/`, questions)
    .subscribe((response) => {
      this.notificationService.success(`Success`,"Survey created successfully")
      this.router.navigate(["/survey/survey-list"])
    }, (err) => {
      this.notificationService.danger("Error", err.error.message)
    })
  }

  getQuestions() {
    return this.http.get(`${this.url}txn/review-questions/`)
  }

  submitResponse(response) {
    return this.http.post(`${this.url}txn/review-questions/create-response/`, response)
  }

  deleteQuestion(questionId) {
    return this.http.delete(`${this.url}txn/review-questions/${questionId}/`)
  }

  getResponseStats(payload: any) {
    // const query = `?${payload?.vendor ? 'vendor='}`
    let params = new HttpParams();

    // Add query parameters only if they exist
    if (payload?.vendor) {
      params = params.set('vendor', payload?.vendor);
    }

    if (payload?.start_date) {
      params = params.set('start_date', payload?.start_date);
    }

    if (payload?.end_date) {
      params = params.set('end_date', payload?.end_date);
    }
    return this.http.get(`${this.url}txn/review-questions/response-stat/`, { params })
  }

}
