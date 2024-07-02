import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  @Input('length') length;
  @Output('pageEvent') pageEvent = new EventEmitter()
  @Input('pageSize') pageSize = 10;
  @Input('pageSizeOptions') pageSizeOptions = [1, 5, 10, 25, 100, 500, 1000]

  constructor() { }

  ngOnInit(): void {
  }

  onPageChange(value: PageEvent) {
    this.pageEvent.emit({
      pageIndex: value.pageIndex + 1,
      pageSize: value.pageSize
    })
  }

}
