import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductlineComponent } from './productline.component';

describe('ProductlineComponent', () => {
  let component: ProductlineComponent;
  let fixture: ComponentFixture<ProductlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
