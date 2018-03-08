import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytmrequestComponent } from './paytmrequest.component';

describe('PaytmrequestComponent', () => {
  let component: PaytmrequestComponent;
  let fixture: ComponentFixture<PaytmrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaytmrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytmrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
