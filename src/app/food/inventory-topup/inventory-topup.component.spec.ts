import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTopupComponent } from './inventory-topup.component';

describe('InventoryTopupComponent', () => {
  let component: InventoryTopupComponent;
  let fixture: ComponentFixture<InventoryTopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryTopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
