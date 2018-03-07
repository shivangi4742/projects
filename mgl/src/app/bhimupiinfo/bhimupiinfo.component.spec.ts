import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BhimupiinfoComponent } from './bhimupiinfo.component';

describe('BhimupiinfoComponent', () => {
  let component: BhimupiinfoComponent;
  let fixture: ComponentFixture<BhimupiinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BhimupiinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BhimupiinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
