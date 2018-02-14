import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycregComponent } from './kycreg.component';

describe('KycregComponent', () => {
  let component: KycregComponent;
  let fixture: ComponentFixture<KycregComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycregComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
