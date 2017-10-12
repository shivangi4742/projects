import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MglpaymentComponent } from './mglpayment.component';

describe('MglpaymentComponent', () => {
  let component: MglpaymentComponent;
  let fixture: ComponentFixture<MglpaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MglpaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MglpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
