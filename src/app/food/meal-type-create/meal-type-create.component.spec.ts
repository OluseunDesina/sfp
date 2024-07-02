import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealTypeCreateComponent } from './meal-type-create.component';

describe('MealTypeCreateComponent', () => {
  let component: MealTypeCreateComponent;
  let fixture: ComponentFixture<MealTypeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MealTypeCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MealTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
