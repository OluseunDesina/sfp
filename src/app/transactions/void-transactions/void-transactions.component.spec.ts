import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidTransactionsComponent } from './void-transactions.component';

describe('VoidTransactionsComponent', () => {
  let component: VoidTransactionsComponent;
  let fixture: ComponentFixture<VoidTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
