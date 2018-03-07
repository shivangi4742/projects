import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddproducttocampaignComponent } from './addproducttocampaign.component';

describe('AddproducttocampaignComponent', () => {
  let component: AddproducttocampaignComponent;
  let fixture: ComponentFixture<AddproducttocampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddproducttocampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddproducttocampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
