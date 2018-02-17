import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductcatalogComponent } from './productcatalog.component';

describe('ProductcatalogComponent', () => {
  let component: ProductcatalogComponent;
  let fixture: ComponentFixture<ProductcatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductcatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductcatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
