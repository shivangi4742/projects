import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SodexoresponseComponent } from './sodexoresponse.component';

describe('SodexoresponseComponent', () => {
  let component: SodexoresponseComponent;
  let fixture: ComponentFixture<SodexoresponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SodexoresponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SodexoresponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
