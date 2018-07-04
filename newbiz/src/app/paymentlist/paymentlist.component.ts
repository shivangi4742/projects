
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, EventEmitter } from '@angular/core';

import { MaterializeAction } from 'angular2-materialize';
import { UtilsService, User, UserService, PaymentLinks, CampaignService, Status, LocationService, StoreService } from 'benowservices';

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
  isCopied91: boolean = false;
  paymentlink: PaymentLinks[];
  user: User;
  pay: boolean = false;
  page: number = 1;
  numPages: number;
  activepay: PaymentLinks[];
  inactivepay: PaymentLinks[];
  processing:boolean= false;
  pr:boolean= false;
  savedURL:string;
  tranactivepay:boolean = false;
  traninactivepay:boolean = false;
  storeURL: string;

  constructor(private translate: TranslateService, private utilsService: UtilsService, private storeService: StoreService,
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
      this.storeService.fetchStoreDetais(this.user.merchantCode)
        .then(res => this.storeInitiated(res));
    }
  }

  storeInitiated(res: any) {
    this.storeURL = 'https://' + res.storeUrl + '.benow.in';
    this.campaignService.merchantpaymentlink(this.user.merchantCode, this.page, this.storeURL)
      .then(res => this.initdtail(res));
  }

  previous() {
    this.processing = true;
    this.numPages = 0;
    this.campaignService.merchantpaymentlink(this.user.merchantCode, (--this.page), this.storeURL)
      .then(res => this.initdtail(res));
  }

  next() {
    this.numPages = 0; 
    this.processing = true;
    this.campaignService.merchantpaymentlink(this.user.merchantCode, (++this.page), this.storeURL)
      .then(res => this.initdtail(res));
  }

  setActiveTab(t: number) {
    this.active = t;

  }

  getStatus(): Status {
    return this.utilsService.getStatus();
  }

  initdtail(res) {
    this.numPages = res.pages;
    if (res.links && res.links.length > 0) {
      this.pay = false;
      this.paymentlink = res;
      let me = this;
      this.activepay = new Array<PaymentLinks>();
      this.inactivepay = new Array<PaymentLinks>();
      res.links.forEach(function (a: any) {
        if (a.isactive == true) {
          me.activepay.push(new PaymentLinks(a.discription, a.url, a.id,
            a.startdate, a.expirydate, a.amount, a.fileURL, a.isactive));
        }
        else {
          me.inactivepay.push(new PaymentLinks(a.discription, a.url, a.id,
            a.startdate, a.expirydate, a.amount, a.fileURL, a.isactive));
        }
      });
      //console.log(this.activepay, this.inactivepay);
    } 
    else {
      this.pay = true;
    }
    this.processing= false;
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

  createpay() {
    this.router.navigateByUrl('/createpaylink');
  }

  seesales() {
    this.router.navigateByUrl('/transactionhistory');
  }

  expirelink(id:any){
    let expirydate = this.utilsService.getCurDateString();
      this.campaignService.expirelink(id, this.user.merchantCode,expirydate)
        .then(res => this.expiredet(res));
          
  }
  expiredet(res) {
    if(res.responseFromAPI== true){
     this.processing = true;
     this.campaignService.merchantpaymentlink(this.user.merchantCode, this.page, this.storeURL)
        .then(res => this.initdtail(res));
    }
  }
  share(res){
    this.savedURL= res;
  }
   twitterbutton() {
    window.open('https://twitter.com/share?url=' + this.savedURL,'', 
    'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    return false;
  }

  fbClick() {
    window.open('https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&u=' + 
    this.savedURL + '&display=popup&ref=plugin&src=share_button', '',
     'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    return false;
  }

 
}




