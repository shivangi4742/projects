import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectproductsComponent } from './selectproducts.component';

describe('SelectproductsComponent', () => {
  let component: SelectproductsComponent;
  let fixture: ComponentFixture<SelectproductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectproductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
