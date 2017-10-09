import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessmglComponent } from './successmgl.component';

describe('SuccessmglComponent', () => {
  let component: SuccessmglComponent;
  let fixture: ComponentFixture<SuccessmglComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessmglComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessmglComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
