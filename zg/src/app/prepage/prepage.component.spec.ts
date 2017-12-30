import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepageComponent } from './prepage.component';

describe('PrepageComponent', () => {
  let component: PrepageComponent;
  let fixture: ComponentFixture<PrepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
