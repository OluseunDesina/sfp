import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCartererUploadComponent } from './bulk-carterer-upload.component';

describe('BulkCartererUploadComponent', () => {
  let component: BulkCartererUploadComponent;
  let fixture: ComponentFixture<BulkCartererUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkCartererUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCartererUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
