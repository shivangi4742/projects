import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycthanksComponent } from './kycthanks.component';

describe('KycthanksComponent', () => {
  let component: KycthanksComponent;
  let fixture: ComponentFixture<KycthanksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycthanksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycthanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
