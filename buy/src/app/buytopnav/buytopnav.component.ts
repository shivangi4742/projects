import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { StoreService, CartService, Cart } from 'benowservices';

@Component({
  selector: 'buytopnav',
  templateUrl: './buytopnav.component.html',
  styleUrls: ['./buytopnav.component.css']
})
export class BuytopnavComponent implements OnInit {
  numCartItems: number;
  cartLink: string;
  storeHome: string;
  merchantCode: string;
  subscription: Subscription;
  subscription2: Subscription;

  constructor(private storeService: StoreService, private cartService: CartService) { 
    let me: any = this; 
    this.subscription = this.cartService.numItemsChanged().subscribe(message => me.numCartItems = message);    
    this.subscription2 = this.storeService.merchantAssigned().subscribe(message => me.assignLinks(message));
  }

  cartFilled(res: Cart) {
    if(res && res.items && res.items.length > 0)
      this.numCartItems = res.items.length;
  }

  assignLinks(mcode: string) {
    this.merchantCode = mcode;
    if(this.merchantCode) {
      this.storeHome = '/' + this.merchantCode + '/store';
      this.cartLink =  '/' + this.merchantCode + '/cart';

      if(!(window && window.location && window.location.href && window.location.href.indexOf('/cart') > 0))
        this.cartService.getCart(this.merchantCode)
          .then(res => this.cartFilled(res));
    }
  }

  ngOnInit() {
  }
}
