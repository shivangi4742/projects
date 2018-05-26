import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilenoComponent } from './mobileno.component';

describe('MobilenoComponent', () => {
  let component: MobilenoComponent;
  let fixture: ComponentFixture<MobilenoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilenoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
