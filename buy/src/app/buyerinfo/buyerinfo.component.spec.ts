import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerinfoComponent } from './buyerinfo.component';

describe('BuyerinfoComponent', () => {
  let component: BuyerinfoComponent;
  let fixture: ComponentFixture<BuyerinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
