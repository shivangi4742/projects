import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { CartService, Cart, StoreService, UtilsService, PaymentlinkService } from 'benowservices';

@Component({
  selector: 'pg',
  templateUrl: './pg.component.html',
  styleUrls: ['./pg.component.css']
})
export class PgComponent implements OnInit {
  cf: number;
  amount: number;
  id: string;
  burl: string;
  pgURL: string;
  merchantCode: string;
  cart: Cart;
  plInfo: any;
  settings: any;
  isPaymentlink: boolean = false;
  ismobileview: boolean = false;

  constructor(private route: ActivatedRoute, private cartService: CartService, private storeService: StoreService, private router: Router,
    private utilsService: UtilsService, private paymentlinkService: PaymentlinkService) { }

  fillCart(res: Cart) {
    if(res) {
      this.amount = this.cartService.getCartTotal();
      if(this.cf > 0)
        this.amount = Math.round(this.amount * 102.36) / 100;
  
      this.cart = res;
      this.submitMe();  
    }
    else
      this.router.navigateByUrl('/' + this.merchantCode + '/cart');
  }

  fillSettings(res: any) {
    if(res) {
      this.settings = res;
      if(this.isPaymentlink)
        this.submitMe();        
    }
    else
      this.router.navigateByUrl('/' + this.merchantCode + '/cart');
  }

  submitMe() {
    let pgForm: any = <HTMLFormElement>document.getElementById('paymentForm');
    if (this.cart && this.settings)
      setTimeout(function() { pgForm.submit(); }, 200);
    else {
      let me: any = this;
      setTimeout(function () {
        me.submitMe();
      }, 100);
    }
  }

  ngOnInit() {
    this.pgURL = this.utilsService.getpgURL();
    this.ismobileview = this.utilsService.isAnyMobile();
    this.id = this.route.snapshot.params['id'];
    this.cf = +this.route.snapshot.params['cf'];
    this.merchantCode = this.route.snapshot.params['code'];
    let url: string = window.location.href;
    if(this.utilsService.getIsDevEnv())
      url = this.utilsService.getTestDomainURL();

    if(url) {
      url = url.toLowerCase().replace('https://', '').replace('http://', '').replace('.benow.in', '');
      let indx: number = url.indexOf('/');
      if(indx > 0)
        this.burl = url.substring(0, indx);
      else
        this.burl = url;
    }
    
    if(this.id && this.merchantCode) {
      this.cartService.getCart(this.merchantCode)
        .then(res => this.fillCart(res));

      this.storeService.fetchStoreDetails(this.merchantCode)
        .then(res2 => this.fillSettings(res2));
    }
    else {
      this.plInfo = this.paymentlinkService.getPaymentlinkDetails();
      if(this.plInfo && this.plInfo.transactionId && this.plInfo.merchantCode) {
        this.isPaymentlink = true;
        this.id = this.plInfo.transactionId;
        this.amount = this.plInfo.totalAmount;
        this.merchantCode = this.plInfo.merchantCode;
        this.cart = new Cart(this.plInfo.name, this.plInfo.phone, this.plInfo.email, this.plInfo.address, null, this.merchantCode, 
          this.plInfo.paymentMode, this.plInfo.pin, this.plInfo.city, this.plInfo.state);
        this.storeService.fetchStoreDetails(this.merchantCode)
          .then(res2 => this.fillSettings(res2));
      }
      else
        this.router.navigateByUrl('/');
    }    
  }
}
