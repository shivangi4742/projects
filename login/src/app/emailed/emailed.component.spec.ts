import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailedComponent } from './emailed.component';

describe('EmailedComponent', () => {
  let component: EmailedComponent;
  let fixture: ComponentFixture<EmailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
