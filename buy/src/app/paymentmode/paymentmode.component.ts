import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SDK, CampaignService } from 'benowservices';

@Component({
  selector: 'paymentmode',
  templateUrl: './paymentmode.component.html',
  styleUrls: ['./paymentmode.component.css']
})
export class PaymentmodeComponent implements OnInit {
  sdk: SDK;

  constructor(private campaignService: CampaignService, private router: Router) { }

  ngOnInit() {
    this.sdk = this.campaignService.getCurrCampaign();
  }

  onSubmit() {
    this.campaignService.setCurrCampaign(this.sdk);
  }
}
