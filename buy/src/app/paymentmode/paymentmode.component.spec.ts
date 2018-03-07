import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentmodeComponent } from './paymentmode.component';

describe('PaymentmodeComponent', () => {
  let component: PaymentmodeComponent;
  let fixture: ComponentFixture<PaymentmodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentmodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentmodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
