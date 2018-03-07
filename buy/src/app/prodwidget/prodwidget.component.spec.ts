import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdwidgetComponent } from './prodwidget.component';

describe('ProdwidgetComponent', () => {
  let component: ProdwidgetComponent;
  let fixture: ComponentFixture<ProdwidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdwidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdwidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
