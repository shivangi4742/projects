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
  storeHome: string;
  subscription: Subscription;
  subscription2: Subscription;

  constructor(private storeService: StoreService, private cartService: CartService) { 
    let me: any = this; 
    this.subscription = this.storeService.homeAssigned().subscribe(message => me.storeHome = message);  
    this.subscription2 = this.cartService.numItemsChanged().subscribe(message => me.numCartItems = message);    
  }

  cartFilled(res: Cart) {
    if(res && res.items && res.items.length > 0)
      this.numCartItems = res.items.length;
  }

  ngOnInit() {
    if(!(window && window.location && window.location.href && window.location.href.indexOf('/cart') > 0))
      this.cartService.getCart()
        .then(res => this.cartFilled(res))
  }
}
