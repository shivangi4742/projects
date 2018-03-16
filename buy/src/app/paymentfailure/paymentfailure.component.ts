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
  cartLink: string;
  merchantCode: string;
  settings: any;

  constructor(private activatedRoute: ActivatedRoute, private storeService: StoreService) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    this.cartLink = '/' + this.merchantCode + '/paymentmode';
    this.storeService.assignMerchant(this.merchantCode);
    this.storeService.fetchStoreDetails(this.merchantCode)
      .then(res => this.settings = res);
  }

}
