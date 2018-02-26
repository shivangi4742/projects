import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecampaignComponent } from './createcampaign.component';

describe('CreatecampaignComponent', () => {
  let component: CreatecampaignComponent;
  let fixture: ComponentFixture<CreatecampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatecampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatecampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
