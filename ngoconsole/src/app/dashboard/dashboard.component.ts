import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Campaign, CampaignSummary, CampaignService } from 'benowservices';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  campaigns: Campaign[];
  campaignSummary: CampaignSummary;

  constructor(private campaignService: CampaignService, private router: Router) { }

  ngOnInit(): void {
    this.getCampaigns();
    this.getCampaignSummary();
  }

  getCampaigns(): void {
    this.campaignService.getCampaigns("AA3O1", "2017-07-01", "2017-08-01")
      .then(campaigns => this.campaigns = campaigns);
  }

  getCampaignSummary(): void {
    this.campaignService.getCampaignSummary("AA3O1", "2017-07-01", "2017-08-01")
      .then(cSummary => this.campaignSummary = cSummary);
  }

  onAddDonorClick(): void {
    this.router.navigate(['/adddonor']);
  }

  onSocialProfileClick(): void{
    this.router.navigate(['/socialprofile']);
  }
}