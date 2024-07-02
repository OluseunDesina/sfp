import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAdminCreateComponent } from './company-admin-create.component';

describe('CompanyAdminCreateComponent', () => {
  let component: CompanyAdminCreateComponent;
  let fixture: ComponentFixture<CompanyAdminCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyAdminCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAdminCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
