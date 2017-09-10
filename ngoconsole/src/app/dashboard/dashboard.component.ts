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

  fillCampaigns(cmps: Campaign[]) {
    console.log('cpms', cmps);
    this.campaigns = cmps;
  }

  fillCampaignSummary(cs: CampaignSummary) {
    console.log('cs', cs);
        
  }

  getCampaigns(): void {
    this.campaignService.getCampaigns(this.user.merchantCode, this.utilsService.getLastYearDateString(), this.utilsService.getNextYearDateString())
      .then(campaigns => this.fillCampaigns(campaigns));
  }

  getCampaignSummary(): void {
    this.campaignService.getCampaignSummary(this.user.merchantCode, this.utilsService.getLastYearDateString(), this.utilsService.getNextYearDateString())
      .then(cSummary => this.campaignSummary = cSummary);
  }

  onAddDonorClick(): void {
    this.router.navigate(['/adddonor']);
  }

  onSocialProfileClick(): void{
    this.router.navigate(['/socialprofile']);
  }
}