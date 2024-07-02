import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentAgreementComponent } from './consent-agreement.component';

describe('ConsentAgreementComponent', () => {
  let component: ConsentAgreementComponent;
  let fixture: ComponentFixture<ConsentAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
