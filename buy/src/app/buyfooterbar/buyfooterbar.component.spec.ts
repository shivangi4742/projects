import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyfooterbarComponent } from './buyfooterbar.component';

describe('BuyfooterbarComponent', () => {
  let component: BuyfooterbarComponent;
  let fixture: ComponentFixture<BuyfooterbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyfooterbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyfooterbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
