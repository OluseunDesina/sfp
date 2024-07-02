import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorStaffCreateComponent } from './vendor-staff-create.component';

describe('VendorStaffCreateComponent', () => {
  let component: VendorStaffCreateComponent;
  let fixture: ComponentFixture<VendorStaffCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorStaffCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorStaffCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
