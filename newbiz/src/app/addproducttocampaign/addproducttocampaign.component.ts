import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SDK, CampaignService, LocationService } from 'benowservices';

@Component({
  selector: 'addproducttocampaign',
  templateUrl: './addproducttocampaign.component.html',
  styleUrls: ['./addproducttocampaign.component.css']
})
export class AddproducttocampaignComponent implements OnInit {
  campaign: SDK;

  constructor(private campaignService: CampaignService, private locationService: LocationService, private router: Router) { }

  ngOnInit() {
    this.campaign = this.campaignService.getCurrCampaign();
    if(this.campaign && this.campaign.title) {
      this.locationService.setLocation('createcampaign');

    }
    else
      this.router.navigateByUrl('/createcampaign');  
    
  }
}
