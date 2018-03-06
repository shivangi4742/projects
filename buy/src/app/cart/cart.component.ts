import { Component, OnInit } from '@angular/core';

import { Cart, CartItem, Product } from 'benowservices';

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  isLoaded: boolean = false;
  cart: Cart;

  constructor() { }

  ngOnInit() {
    this.isLoaded = true;
  }

  isEmpty(): boolean {
    if(!this.isLoaded || (this.cart && this.cart.items && this.cart.items.length > 0))
      return false;

    return true;
  }

  addQty(item: CartItem, qty: number) {
    item.quantity += qty;
    if(item.quantity < 1)
      item.quantity = 1;
  }

  remove(id: string) {
    if(id && this.cart && this.cart.items && this.cart.items.length > 0) {
      this.cart.items = this.cart.items.filter(i => i.productId != id);
    }    
  }

  getTotalDiscount(): number {
    return this.getTotalPrice() - this.getTotalAmount();
  }

  getTotalAmount(): number {
    let ta: number = 0;
    if(this.cart && this.cart.items && this.cart.items.length > 0) {
      this.cart.items.forEach(function(i) {
        ta += i.offerPrice;
      });
    }

    return ta;    
  }

  getTotalPrice(): number {
    let tp: number = 0;
    if(this.cart && this.cart.items && this.cart.items.length > 0) {
      this.cart.items.forEach(function(i) {
        tp += i.origPrice;
      });
    }

    return tp;
  }
}
