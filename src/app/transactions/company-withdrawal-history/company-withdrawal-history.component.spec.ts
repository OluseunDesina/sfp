import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyWithdrawalHistoryComponent } from './company-withdrawal-history.component';

describe('CompanyWithdrawalHistoryComponent', () => {
  let component: CompanyWithdrawalHistoryComponent;
  let fixture: ComponentFixture<CompanyWithdrawalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyWithdrawalHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyWithdrawalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
