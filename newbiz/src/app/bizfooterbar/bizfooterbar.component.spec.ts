import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BizfooterbarComponent } from './bizfooterbar.component';

describe('BizfooterbarComponent', () => {
  let component: BizfooterbarComponent;
  let fixture: ComponentFixture<BizfooterbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BizfooterbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BizfooterbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
