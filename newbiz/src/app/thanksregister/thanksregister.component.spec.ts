import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanksregisterComponent } from './thanksregister.component';

describe('ThanksregisterComponent', () => {
  let component: ThanksregisterComponent;
  let fixture: ComponentFixture<ThanksregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThanksregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThanksregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
