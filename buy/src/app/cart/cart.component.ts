import { Component, OnInit } from '@angular/core';

import { Cart, CartItem, Product, CartService, StoreService } from 'benowservices';

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  homeLink: string;
  cart: Cart;
  isLoaded: boolean = false;

  constructor(private cartService: CartService, private storeService: StoreService) { }

  ngOnInit() {
    this.cartService.getCart()
      .then(res => this.init(res));
  }

  init(res: Cart) {
    this.cart = res;
    this.cartService.broadcastCart();
    this.isLoaded = true;
    if(this.cart.merchantCode) {
      this.homeLink = '/store/' + this.cart.merchantCode;
      this.storeService.assignHome(this.homeLink);
    }
  }

  isEmpty(): boolean {
    if(!this.isLoaded || (this.cart && this.cart.items && this.cart.items.length > 0))
      return false;

    return true;
  }

  addQty(item: CartItem, qty: number) {
    let newqty: number = item.quantity + qty;
    if(newqty < 1)
      newqty = 1;

    this.cart = this.cartService.setCartItemQuantity(item.productId, item.variantId, item.sizeId, newqty);
  }

  remove(p: CartItem) {
    this.cart = this.cartService.deleteFromCart(p.productId, p.variantId, p.sizeId);     
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
