import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { CartService, Cart, StoreService, UtilsService } from 'benowservices';

@Component({
  selector: 'pg',
  templateUrl: './pg.component.html',
  styleUrls: ['./pg.component.css']
})
export class PgComponent implements OnInit {
  cf: number;
  amount: number;
  id: string;
  pgURL: string;
  merchantCode: string;
  cart: Cart;
  settings: any;
  ismobileview: boolean = false;

  constructor(private route: ActivatedRoute, private cartService: CartService, private storeService: StoreService, private router: Router,
    private utilsService: UtilsService) { }

  fillCart(res: Cart) {
    if(res) {
      this.amount = this.cartService.getCartTotal();
      if(this.cf > 0)
        this.amount = Math.round(this.amount * 102) / 100;
  
      this.cart = res;
      this.submitMe();  
    }
    else
      this.router.navigateByUrl('/' + this.merchantCode + '/cart');
  }

  fillSettings(res: any) {
    if(res)
      this.settings = res;
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
    this.id = this.route.snapshot.params['id'];
    this.cf = +this.route.snapshot.params['cf'];
    this.merchantCode = this.route.snapshot.params['code'];
    if(this.id && this.merchantCode) {
      this.cartService.getCart(this.merchantCode)
        .then(res => this.fillCart(res));

      this.storeService.fetchStoreDetails(this.merchantCode)
        .then(res2 => this.fillSettings(res2));

      this.pgURL = this.utilsService.getpgURL();
      this.ismobileview = this.utilsService.isAnyMobile();
    }    
  }
}
