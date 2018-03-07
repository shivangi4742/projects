import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { LocationService, CampaignService } from 'benowservices';

@Component({
  selector: 'leftnav',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.css']
})
export class LeftnavComponent implements OnInit {
  subscription: Subscription;
  location: string = 'dashboard';

  constructor(private router: Router, private route: ActivatedRoute, private locationService: LocationService, 
    private campaignService: CampaignService) {
    let me: any = this; 
    this.subscription = this.locationService.locationChanged().subscribe(message => me.location = message);    
  }

  ngOnInit() {
  }

  goto(path: string) {
    if(this.location != path) {
      if(path == 'createcampaign')
        this.campaignService.setCurrCampaign(null);

      this.router.navigateByUrl('/' + path);
    }
  }

}
