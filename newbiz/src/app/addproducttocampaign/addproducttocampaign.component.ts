import { Component, OnInit } from '@angular/core';

import { SDK, CampaignService } from 'benowservices';

@Component({
  selector: 'addproducttocampaign',
  templateUrl: './addproducttocampaign.component.html',
  styleUrls: ['./addproducttocampaign.component.css']
})
export class AddproducttocampaignComponent implements OnInit {
  campaign: SDK;

  constructor(private campaignService: CampaignService) { }

  ngOnInit() {
    this.campaign = this.campaignService.getCurrCampaign();
  }
}
