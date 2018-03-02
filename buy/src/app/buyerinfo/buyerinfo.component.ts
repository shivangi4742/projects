import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SDK, CampaignService } from 'benowservices';

@Component({
  selector: 'buyerinfo',
  templateUrl: './buyerinfo.component.html',
  styleUrls: ['./buyerinfo.component.css']
})
export class BuyerinfoComponent implements OnInit {
  sdk: SDK;

  constructor(private campaignService: CampaignService, private router: Router) { }

  ngOnInit() {
    this.sdk = this.campaignService.getCurrCampaign();
  }

  onSSubmit() {
    this.campaignService.setCurrCampaign(this.sdk);    
    this.router.navigateByUrl('/paymentmode');
  }

  onSubmit() {
    this.campaignService.setCurrCampaign(this.sdk);
  }
}
