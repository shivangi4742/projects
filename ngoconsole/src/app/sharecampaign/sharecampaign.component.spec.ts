import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharecampaignComponent } from './sharecampaign.component';

describe('SharecampaignComponent', () => {
  let component: SharecampaignComponent;
  let fixture: ComponentFixture<SharecampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharecampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharecampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
