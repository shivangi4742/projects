import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuytopnavComponent } from './buytopnav.component';

describe('BuytopnavComponent', () => {
  let component: BuytopnavComponent;
  let fixture: ComponentFixture<BuytopnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuytopnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuytopnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
