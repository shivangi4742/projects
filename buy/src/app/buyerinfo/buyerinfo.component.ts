import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Cart, CartService, StoreService, SDKService } from 'benowservices';

@Component({
  selector: 'buyerinfo',
  templateUrl: './buyerinfo.component.html',
  styleUrls: ['./buyerinfo.component.css']
})
export class BuyerinfoComponent implements OnInit {
  paidAmount: number;
  merchantCode: string;
  cart: Cart;
  settings: any;
  processing: boolean = false;

  constructor(private cartService: CartService, private router: Router, private activatedRoute: ActivatedRoute, private storeService: StoreService,
    private sdkService: SDKService) { }

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

  codMarked(res: any) {
    if(res && res.txnRefNumber && res.transactionStatus && res.transactionStatus.trim().toLowerCase() == 'successful')
      this.router.navigateByUrl('/' + this.merchantCode + '/paymentsuccess/' + res.txnRefNumber);      
    else {
      //error handling.
    }

    this.processing = false;
  }

  finishCashPayment(res: any) {
    if (res && res.transactionRef)
      this.sdkService.saveCashPaymentSuccess(this.paidAmount, res.transactionRef, this.cart.phone, this.merchantCode, this.settings.displayName, '')
        .then(res2 => this.codMarked(res2));
    else {
      this.processing = false;
      //error handling.
    }
  }

  pay() {
    if(this.cartService.isCartPayable()) {
      switch(this.cart.paymentMode) {
        case 'CASH':
          this.paidAmount = this.cartService.getCartTotal();
          this.cartService.startCashPaymentProcess(this.settings.displayName)
            .then(res => this.finishCashPayment(res));
          break;
        default:
          break;
      }      
    }
  }

  onSubmit() {
    this.processing = true;
    this.cartService.setBuyerInfo(this.cart.name, this.cart.email, this.cart.address, this.cart.phone, this.merchantCode);
    this.cartService.setPaymentMode(this.cart.paymentMode, this.merchantCode);
    this.pay();
  }
}
