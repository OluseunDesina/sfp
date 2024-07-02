import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidWithdrawalHistoryComponent } from './sid-withdrawal-history.component';

describe('SidWithdrawalHistoryComponent', () => {
  let component: SidWithdrawalHistoryComponent;
  let fixture: ComponentFixture<SidWithdrawalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidWithdrawalHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidWithdrawalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
