import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { shareReplay } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss']
})
export class ReviewDialogComponent implements OnInit {
  rating: number = 0;
  review = "";

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  handleRating(event: number) {
    this.rating = event;
  }

  closeDialog(value) {
    this.dialogRef.close(value);
  }

  onSubmit() {
    if (!this.review) {
      alert(`you need to leave a review`);
      return;
    }
    if (this.rating < 1) {
      alert(`you need to leave a rating`);
      return;
    }
    const data = {
      rating: this.rating,
      review: this.review,
      transaction: this.data.id
    }
    this.dashboardService.rateVendor(data)
      .pipe(
        shareReplay(1)
      )
      .subscribe(() => {
        this.closeDialog(true)
      }, (err) => {
        this.closeDialog(true)
        this.errorService.handleError(err.error.transaction[0])
      })
  }

}
