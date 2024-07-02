import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupPersonalComponent } from './topup-personal.component';

describe('TopupPersonalComponent', () => {
  let component: TopupPersonalComponent;
  let fixture: ComponentFixture<TopupPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopupPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
