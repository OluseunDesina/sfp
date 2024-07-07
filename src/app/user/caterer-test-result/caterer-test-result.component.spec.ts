import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatererTestResultComponent } from './caterer-test-result.component';

describe('CatererTestResultComponent', () => {
  let component: CatererTestResultComponent;
  let fixture: ComponentFixture<CatererTestResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatererTestResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatererTestResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
