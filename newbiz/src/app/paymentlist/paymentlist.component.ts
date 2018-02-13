
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, EventEmitter } from '@angular/core';

import { MaterializeAction } from 'angular2-materialize';
import { UtilsService, User, UserService, PaymentLinks, CampaignService, Status, LocationService } from 'benowservices';

import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-paymentlist',
  templateUrl: './paymentlist.component.html',
  styleUrls: ['./paymentlist.component.css']
})
export class PaymentlistComponent implements OnInit {
  active: number = 0;
  detailsExpanded: boolean = false;
  selectedId: string;
  isInitial: boolean = true;
  isCopied1: boolean = false;
  paymentlink: PaymentLinks[];
  user: User;
  pay: boolean ;
  page: number = 1;
  numPages: number;
  activepay:PaymentLinks[];
  inactivepay:PaymentLinks[];
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

  }
  getStatus(): Status {
    return this.utilsService.getStatus();
  }


  initdtail(res){    
    if (res.length > 0) {
      this.pay = false;
      this.paymentlink = res; 

            let me = this;
             this.activepay = new Array<PaymentLinks>();
             this.inactivepay = new Array<PaymentLinks>();
                    res.forEach(function(a: any) {
                      if(a.isactive == true)
                        {
                      
                        me.activepay.push(new PaymentLinks(a.discription,a.url,a.id, 
                                a.startdate,a.expirydate, a.amount,a.fileURL, a.isactive));
                        }
                        else{
                           me.inactivepay.push(new PaymentLinks(a.discription,a.url,a.id, 
                                a.startdate,a.expirydate, a.amount,a.fileURL, a.isactive));
                        }
                                  
                    });
                   // console.log( me.activepay, 'ac'); console.log(me.inactivepay, 'inac');
                    
             return  me.inactivepay;
           
       }

    else {
       this.pay = true;
    }
  // return this.paymentlink;
  }
  arrowChange(id: any) {
    if (this.selectedId == id) {
      this.detailsExpanded = !this.detailsExpanded;
    }
    else {
      this.detailsExpanded = true;
    }
    this.selectedId = id;
  }

  changeIcon(id: any) {
    let a: any = document.getElementById(id);
    a.click();
    this.arrowChange(id);
  }

  isSelected(id) {
    if (this.selectedId == id)
      return true;

    return false;
  }

  changeIconMob() {
    let a: any = document.getElementById('advanceMob');
    a.click();
    this.arrowChange('a');
  }
}




