import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReoprterrorComponent } from './reoprterror.component';

describe('ReoprterrorComponent', () => {
  let component: ReoprterrorComponent;
  let fixture: ComponentFixture<ReoprterrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReoprterrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReoprterrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
