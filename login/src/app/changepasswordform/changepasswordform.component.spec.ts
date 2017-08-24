import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangepasswordformComponent } from './changepasswordform.component';

describe('ChangepasswordformComponent', () => {
  let component: ChangepasswordformComponent;
  let fixture: ComponentFixture<ChangepasswordformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangepasswordformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangepasswordformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
