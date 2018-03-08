import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytmresponseComponent } from './paytmresponse.component';

describe('PaytmresponseComponent', () => {
  let component: PaytmresponseComponent;
  let fixture: ComponentFixture<PaytmresponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaytmresponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytmresponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
