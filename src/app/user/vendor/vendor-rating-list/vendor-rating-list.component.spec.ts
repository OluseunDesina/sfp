import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRatingListComponent } from './vendor-rating-list.component';

describe('VendorRatingListComponent', () => {
  let component: VendorRatingListComponent;
  let fixture: ComponentFixture<VendorRatingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorRatingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorRatingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
