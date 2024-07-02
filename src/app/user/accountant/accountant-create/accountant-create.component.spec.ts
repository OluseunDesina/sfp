import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountantCreateComponent } from './accountant-create.component';

describe('AccountantCreateComponent', () => {
  let component: AccountantCreateComponent;
  let fixture: ComponentFixture<AccountantCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountantCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountantCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
