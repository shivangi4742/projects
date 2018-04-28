import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { LocationService, CampaignService, User, UserService } from 'benowservices';

@Component({
  selector: 'leftnav',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.css']
})
export class LeftnavComponent implements OnInit {
  subscription: Subscription;
  location: string = 'dashboard';
  user:User;
  processing:boolean= false;
  constructor(private router: Router, private route: ActivatedRoute, private locationService: LocationService, 
    private campaignService: CampaignService, private userService:UserService) {
    let me: any = this; 
    this.subscription = this.locationService.locationChanged().subscribe(message => me.location = message);    
  }

  ngOnInit() {
    this.userService.getUser()
    .then(res => this.init(res));
}

init(res: User) {
  this.user = res;
}
oncheckadd() {
  //console.log(this.user.registerd , this.user.kycverified)
  if(!this.user.registerd) {
    if(this.user.kycverified){
      return true;
    }
    return true;
  }
}
  goto(path: string) {
    if(this.location != path) {
      if(path == 'createcampaign')
        this.campaignService.setCurrCampaign(null);

      this.router.navigateByUrl('/' + path);
    }
  }

}
