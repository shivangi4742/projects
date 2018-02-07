import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiztopnavComponent } from './biztopnav.component';

describe('BiztopnavComponent', () => {
  let component: BiztopnavComponent;
  let fixture: ComponentFixture<BiztopnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiztopnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiztopnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
