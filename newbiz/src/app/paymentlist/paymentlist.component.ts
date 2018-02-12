
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, EventEmitter } from '@angular/core';

import { MaterializeAction } from 'angular2-materialize';
import { UtilsService, User, UserService, PaymentLinks,CampaignService, Status, LocationService } from 'benowservices';

import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-paymentlist',
  templateUrl: './paymentlist.component.html',
  styleUrls: ['./paymentlist.component.css']
})
export class PaymentlistComponent implements OnInit {
  active: number = 0;
  isInitial: boolean = true;
  isCopied1: boolean = false;
  paymentlink: PaymentLinks[];
  activepl: PaymentLinks[];
  inactive: PaymentLinks[];
  user: User;
  pay: string[];
  page: number = 1;
  numPages: number;
  modalActions: any = new EventEmitter<string | MaterializeAction>();
  constructor(private translate: TranslateService, private utilsService: UtilsService,
    private userService: UserService, private campaignService: CampaignService, private router: Router,
    
    private route: ActivatedRoute, private locationService: LocationService) { }

  ngOnInit() {
     this.locationService.setLocation('paymentlist');  
    this.userService.getUser()
      .then(res => this.init(res));
    
  }

  init(usr: User) {
    if (usr && usr.id) {
      this.user = usr;
   
      this.campaignService.merchantpaymentlink(this.user.merchantCode, this.page)
        .then(res => this.initdtail(res));
    }

  }
  previous() {
    this.numPages = 0;
    this.campaignService.merchantpaymentlink(this.user.merchantCode, (++this.page))
      .then(res => this.initdtail(res));
  }
  next() {
    this.numPages = 0;
    this.campaignService.merchantpaymentlink(this.user.merchantCode, (--this.page))
      .then(res => this.initdtail(res));
  }
  setActiveTab(t: number) {
    this.active = t;
    this.campaignService.merchantpaymentlink(this.user.merchantCode, (--this.page))
      .then(res => this.initdtail(res));
  }
  getStatus(): Status {
    return this.utilsService.getStatus();
  }

 
  initdtail(res: any) {
    console.log(res);
  this.paymentlink = res;
   for(var i = 0; i<res.length;i++){
    if(res[i].isactive== true) {
       console.log('hello')

      this.activepl = res;
   // console.log(this.paymentlink);
  }
  else {
     this.inactive = res;
   }
  }

}
}




