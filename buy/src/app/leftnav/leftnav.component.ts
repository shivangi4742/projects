import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { StoreService, CartService, Cart, UtilsService } from 'benowservices';
@Component({
  selector: 'leftnav',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.css']
})
export class LeftnavComponent implements OnInit {
  location: string = 'store';
  subs: Subscription;
  merchantCode: string;
  storeHome: string;
  cartLink: string;
  reprtlink: string;
  isPaymentlink: boolean = false;
  showStoreHomeLink: boolean = true;
  showReportErrorLink: boolean = true;

  constructor(private storeService: StoreService, private router: Router, private utilsService: UtilsService) { 
    let me: any = this; 
    this.subs= this.storeService.merchantAssigned().subscribe(message => me.rep(message));
  }

  ngOnInit() {
    let u: string = window.location.href;
    if(this.utilsService.getIsDevEnv())
      u = this.utilsService.getTestDomainURL();

    if(u.indexOf('pay-') >= 0)
      this.isPaymentlink = true;
}

  goto(loc: string) {
    let sn: any = document.getElementById('sidenavelem');
    if(!sn)
      sn = document.getElementById('sidenavelem2');

    if(sn)
      sn.click();

    switch(loc) {
      case 'store':
        this.router.navigateByUrl(this.storeHome);
        break;
      case 'refund':
        break;
      case 'report':
        this.router.navigateByUrl(this.reprtlink);
        break;
      default:
        break;
    }
  }

  rep(mcode:string){
    this.merchantCode = mcode;
    if(this.merchantCode) {
      this.storeHome = '/' + this.merchantCode + '/store';
      this.cartLink =  '/' + this.merchantCode + '/cart';
      this.reprtlink = '/' + this.merchantCode + '/reporterror';
      if(window && window.location && window.location.href && window.location.href.indexOf('/store') > 0)
        this.showStoreHomeLink = false;
      else
        this.showStoreHomeLink = true;

      if(window && window.location && window.location.href && window.location.href.indexOf('/reporterror') > 0)
        this.showReportErrorLink = false;
      else
        this.showReportErrorLink = true;
    }
  }
}
