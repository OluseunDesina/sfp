import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkStudentUploadComponent } from './bulk-student-upload.component';

describe('BulkStudentUploadComponent', () => {
  let component: BulkStudentUploadComponent;
  let fixture: ComponentFixture<BulkStudentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkStudentUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkStudentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
