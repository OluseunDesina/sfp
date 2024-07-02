import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorWithdrawalHistoryComponent } from './vendor-withdrawal-history.component';

describe('VendorWithdrawalHistoryComponent', () => {
  let component: VendorWithdrawalHistoryComponent;
  let fixture: ComponentFixture<VendorWithdrawalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorWithdrawalHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorWithdrawalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
