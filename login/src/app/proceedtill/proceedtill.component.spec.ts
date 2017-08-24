import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedtillComponent } from './proceedtill.component';

describe('ProceedtillComponent', () => {
  let component: ProceedtillComponent;
  let fixture: ComponentFixture<ProceedtillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProceedtillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceedtillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
