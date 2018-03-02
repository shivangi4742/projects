import { Component, OnInit } from '@angular/core';

import { SDK, CampaignService } from 'benowservices';

@Component({
  selector: 'buyerinfo',
  templateUrl: './buyerinfo.component.html',
  styleUrls: ['./buyerinfo.component.css']
})
export class BuyerinfoComponent implements OnInit {
  sdk: SDK;

  constructor(private campaignService: CampaignService) { }

  ngOnInit() {
    this.sdk = this.campaignService.getCurrCampaign();
  }

  onSubmit() {
    
  }
}
