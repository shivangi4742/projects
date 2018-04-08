import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StoreService } from 'benowservices';

@Component({
  selector: 'paymentfailure',
  templateUrl: './paymentfailure.component.html',
  styleUrls: ['./paymentfailure.component.css']
})
export class PaymentfailureComponent implements OnInit {
  id: string;
  merchant: string;
  homeLink: string;
  cartLink: string;
  merchantCode: string;
  settings: any;

  constructor(private activatedRoute: ActivatedRoute, private storeService: StoreService) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    if(this.merchantCode) {
      this.cartLink = '/' + this.merchantCode + '/paymentmode';
      this.storeService.assignMerchant(this.merchantCode);
      this.storeService.fetchStoreDetails(this.merchantCode)
        .then(res => this.settings = res);  
    }
    else {
      this.storeService.getMerchantDetailsFromURL()
        .then(res => this.fillMerchantDetails(res));          
    }
  }

  fillMerchantDetails(m: any) {
    if(m && m.merchantCode) {
      this.merchantCode = m.merchantCode;
      this.homeLink = window.location.href;
      let u: string = window.location.href;
      if(u) {
        let indx = u.indexOf('.benow.in');
        if(indx > 0)
          this.homeLink = u.substring(0, indx);
      }

      this.storeService.assignMerchant(this.merchantCode);
    }
  }
}
