import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgltopnavComponent } from './mgltopnav.component';

describe('MgltopnavComponent', () => {
  let component: MgltopnavComponent;
  let fixture: ComponentFixture<MgltopnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgltopnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgltopnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
