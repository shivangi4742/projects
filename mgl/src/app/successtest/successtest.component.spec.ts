import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesstestComponent } from './successtest.component';

describe('SuccesstestComponent', () => {
  let component: SuccesstestComponent;
  let fixture: ComponentFixture<SuccesstestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccesstestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccesstestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
