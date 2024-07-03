import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartererListComponent } from './carterer-list.component';

describe('CartererListComponent', () => {
  let component: CartererListComponent;
  let fixture: ComponentFixture<CartererListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartererListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartererListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
