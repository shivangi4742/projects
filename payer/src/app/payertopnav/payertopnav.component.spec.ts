import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayertopnavComponent } from './payertopnav.component';

describe('PayertopnavComponent', () => {
  let component: PayertopnavComponent;
  let fixture: ComponentFixture<PayertopnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayertopnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayertopnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
