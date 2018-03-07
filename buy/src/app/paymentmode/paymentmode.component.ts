import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Cart, CartService, StoreService } from 'benowservices';

@Component({
  selector: 'paymentmode',
  templateUrl: './paymentmode.component.html',
  styleUrls: ['./paymentmode.component.css']
})
export class PaymentmodeComponent implements OnInit {
  merchantCode: string;
  cart: Cart;
  settings: any;

  constructor(private cartService: CartService, private router: Router, private storeService: StoreService, 
    private activatedRoute: ActivatedRoute) { }

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

  ngOnInit() {
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    this.storeService.assignMerchant(this.merchantCode);
    this.cartService.getCart(this.merchantCode)
      .then(res => this.fillCart(res));

    this.storeService.fetchStoreDetails(this.merchantCode)
      .then(res2 => this.fillStoreSettings(res2))
  }

  onSubmit() {
    this.cartService.setPaymentMode(this.cart.paymentMode, this.merchantCode);
  }
}
