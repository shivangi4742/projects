import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsuccessComponent } from './paymentsuccess.component';

describe('PaymentsuccessComponent', () => {
  let component: PaymentsuccessComponent;
  let fixture: ComponentFixture<PaymentsuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
