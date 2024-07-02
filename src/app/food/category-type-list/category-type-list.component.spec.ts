import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTypeListComponent } from './category-type-list.component';

describe('CategoryTypeListComponent', () => {
  let component: CategoryTypeListComponent;
  let fixture: ComponentFixture<CategoryTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
