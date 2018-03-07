import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Cart, CartService, StoreService } from 'benowservices';

@Component({
  selector: 'buyerinfo',
  templateUrl: './buyerinfo.component.html',
  styleUrls: ['./buyerinfo.component.css']
})
export class BuyerinfoComponent implements OnInit {
  merchantCode: string;
  cart: Cart;
  settings: any;

  constructor(private cartService: CartService, private router: Router, private activatedRoute: ActivatedRoute, private storeService: StoreService) { }

  ngOnInit() {
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    this.storeService.assignMerchant(this.merchantCode);
    this.cartService.getCart(this.merchantCode)
      .then(res => this.fillCart(res));

    this.storeService.fetchStoreDetails(this.merchantCode)
      .then(res2 => this.fillStoreSettings(res2))
  }

  fillStoreSettings(res: any) {
    if(res)
      this.settings = res;
    else
      this.router.navigateByUrl('/' + this.merchantCode + '/cart');
  }

  fillCart(res: Cart) {
    if(res && res.items && res.items.length > 0)
      this.cart = res;
    else
      this.router.navigateByUrl('/' + this.merchantCode + '/cart');
  }

  onSSubmit() {
    this.cartService.setBuyerInfo(this.cart.name, this.cart.email, this.cart.address, this.cart.phone, this.merchantCode);
    this.router.navigateByUrl('/' + this.merchantCode + '/paymentmode');
  }

  finishCashPayment(res: any) {
    console.log(res);
  }

  pay() {
    if(this.cartService.isCartPayable()) {
      switch(this.cart.paymentMode) {
        case 'CASH':
          this.cartService.startCashPaymentProcess()
            .then(res => this.finishCashPayment(res));
          break;
        default:
          break;
      }      
    }
  }

  onSubmit() {
    this.cartService.setBuyerInfo(this.cart.name, this.cart.email, this.cart.address, this.cart.phone, this.merchantCode);
    this.cartService.setPaymentMode(this.cart.paymentMode, this.merchantCode);
    this.pay();
  }
}
