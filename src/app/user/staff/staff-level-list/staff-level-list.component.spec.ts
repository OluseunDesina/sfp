import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffLevelListComponent } from './staff-level-list.component';

describe('StaffLevelListComponent', () => {
  let component: StaffLevelListComponent;
  let fixture: ComponentFixture<StaffLevelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffLevelListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffLevelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
