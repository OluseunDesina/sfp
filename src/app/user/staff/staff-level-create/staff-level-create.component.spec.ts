import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffLevelCreateComponent } from './staff-level-create.component';

describe('StaffLevelCreateComponent', () => {
  let component: StaffLevelCreateComponent;
  let fixture: ComponentFixture<StaffLevelCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffLevelCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffLevelCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
