import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailuremglComponent } from './failuremgl.component';

describe('FailuremglComponent', () => {
  let component: FailuremglComponent;
  let fixture: ComponentFixture<FailuremglComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailuremglComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailuremglComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
