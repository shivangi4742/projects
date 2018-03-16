import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeproductdetailComponent } from './seeproductdetail.component';

describe('SeeproductdetailComponent', () => {
  let component: SeeproductdetailComponent;
  let fixture: ComponentFixture<SeeproductdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeproductdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeproductdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
