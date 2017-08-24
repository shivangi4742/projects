import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyformComponent } from './verifyform.component';

describe('VerifyformComponent', () => {
  let component: VerifyformComponent;
  let fixture: ComponentFixture<VerifyformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
