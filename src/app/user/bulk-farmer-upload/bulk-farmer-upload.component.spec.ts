import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkFarmerUploadComponent } from './bulk-farmer-upload.component';

describe('BulkFarmerUploadComponent', () => {
  let component: BulkFarmerUploadComponent;
  let fixture: ComponentFixture<BulkFarmerUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkFarmerUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkFarmerUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
