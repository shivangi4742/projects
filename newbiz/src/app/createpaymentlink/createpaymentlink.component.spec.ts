import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatepaymentlinkComponent } from './createpaymentlink.component';

describe('CreatepaymentlinkComponent', () => {
  let component: CreatepaymentlinkComponent;
  let fixture: ComponentFixture<CreatepaymentlinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatepaymentlinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatepaymentlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
