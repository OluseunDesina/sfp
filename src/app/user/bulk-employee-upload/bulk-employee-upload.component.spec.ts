import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEmployeeUploadComponent } from './bulk-employee-upload.component';

describe('BulkEmployeeUploadComponent', () => {
  let component: BulkEmployeeUploadComponent;
  let fixture: ComponentFixture<BulkEmployeeUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkEmployeeUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkEmployeeUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
