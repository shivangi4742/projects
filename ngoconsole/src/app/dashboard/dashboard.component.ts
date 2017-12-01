import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { User, Campaign, CampaignSummary, CampaignService, UserService, UtilsService, CampaignList } from 'benowservices';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User;
  campaigns: Campaign[];
  campaignSummary: CampaignSummary;
  campaignLink: string = '/newcampaign';

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

      if(!this.utilsService.isNGO(this.user.mccCode))
        this.campaignLink = '/newestall';
    }
  }

  fillCampaigns(cmps: CampaignList) {
    this.campaigns = cmps.allCampaigns;
  }

  fillCampaignSummary(cs: CampaignSummary) {
    console.log('cs', cs);

  }

  getCampaigns(): void {
    this.campaignService.getCampaigns(this.user.merchantCode, this.utilsService.getLastYearDateString(), this.utilsService.getNextYearDateString(), null, null, 1)
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
