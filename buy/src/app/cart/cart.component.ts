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
    this.cart = new Cart('', '', '', '', 
      [new CartItem(1, '1', 'Prod1', 120, 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOV6d6F0ATLa3tf3YiAx7WtO5M17Qh4FnuxP-U4vVonlK9MC6p'), 
      new CartItem(1, '2', 'Prod2', 120, 100, 'https://merchant.benow.in/assets/paymentlink/images/donated.png')]);
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
}
