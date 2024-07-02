import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorStaffListComponent } from './vendor-staff-list.component';

describe('VendorStaffListComponent', () => {
  let component: VendorStaffListComponent;
  let fixture: ComponentFixture<VendorStaffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorStaffListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorStaffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
