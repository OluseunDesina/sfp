import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAdminListComponent } from './company-admin-list.component';

describe('CompanyAdminListComponent', () => {
  let component: CompanyAdminListComponent;
  let fixture: ComponentFixture<CompanyAdminListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyAdminListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
