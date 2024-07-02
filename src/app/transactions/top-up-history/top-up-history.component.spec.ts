import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUpHistoryComponent } from './top-up-history.component';

describe('TopUpHistoryComponent', () => {
  let component: TopUpHistoryComponent;
  let fixture: ComponentFixture<TopUpHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopUpHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopUpHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
