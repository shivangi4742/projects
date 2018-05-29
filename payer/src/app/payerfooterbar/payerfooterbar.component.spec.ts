import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerfooterbarComponent } from './payerfooterbar.component';

describe('PayerfooterbarComponent', () => {
  let component: PayerfooterbarComponent;
  let fixture: ComponentFixture<PayerfooterbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayerfooterbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayerfooterbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
