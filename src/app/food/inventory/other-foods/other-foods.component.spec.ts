import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherFoodsComponent } from './other-foods.component';

describe('OtherFoodsComponent', () => {
  let component: OtherFoodsComponent;
  let fixture: ComponentFixture<OtherFoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherFoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherFoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
