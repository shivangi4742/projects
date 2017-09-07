import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { User, Campaign, CampaignSummary, CampaignService, UserService, UtilsService } from 'benowservices';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User;
  campaigns: Campaign[];
  campaignSummary: CampaignSummary;

  constructor(private campaignService: CampaignService, private router: Router, private userService: UserService, 
    private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.userService.getUser()
      .then(res => this.init(res));
  }
  
  init(usr: User) {
    if(usr && usr.id) {
      this.user = usr;
      this.getCampaigns();
      this.getCampaignSummary();
    }
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