import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenowpaymentComponent } from './benowpayment.component';

describe('BenowpaymentComponent', () => {
  let component: BenowpaymentComponent;
  let fixture: ComponentFixture<BenowpaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenowpaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenowpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
