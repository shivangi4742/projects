import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SucesspaymentlinkComponent } from './sucesspaymentlink.component';

describe('SucesspaymentlinkComponent', () => {
  let component: SucesspaymentlinkComponent;
  let fixture: ComponentFixture<SucesspaymentlinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SucesspaymentlinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucesspaymentlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
