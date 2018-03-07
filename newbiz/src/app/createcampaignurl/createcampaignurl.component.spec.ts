import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecampaignurlComponent } from './createcampaignurl.component';

describe('CreatecampaignurlComponent', () => {
  let component: CreatecampaignurlComponent;
  let fixture: ComponentFixture<CreatecampaignurlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatecampaignurlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatecampaignurlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
