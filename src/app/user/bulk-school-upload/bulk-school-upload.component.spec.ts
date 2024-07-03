import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkSchoolUploadComponent } from './bulk-school-upload.component';

describe('BulkSchoolUploadComponent', () => {
  let component: BulkSchoolUploadComponent;
  let fixture: ComponentFixture<BulkSchoolUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkSchoolUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSchoolUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
