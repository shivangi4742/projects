import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Cart, CartItem, Product, CartService, StoreService, UtilsService } from 'benowservices';

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  homeLink: string;
  merchantCode: string;
  buyerInfoLink: string;
  cart: Cart;
  isLoaded: boolean = false;
  orderShipCharge: number;
  freeship:boolean = false;
  chargeperprod:boolean = false;
  chargePerOrder:boolean = false;
  constructor(private cartService: CartService, private storeService: StoreService, private utilsService: UtilsService, 
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    this.homeLink = '/' + this.merchantCode + '/store';
    this.buyerInfoLink = '/' + this.merchantCode + '/buyerinfo';
    this.storeService.assignMerchant(this.merchantCode);
    this.storeService.fetchStoreDetails(this.merchantCode)
       .then(bres => this.fetchinit(bres));
    this.cartService.getCart(this.merchantCode)
      .then(res => this.init(res));
  }
 fetchinit(bres:any){
  console.log(bres,'bres');
    this.isLoaded = false;
    if(bres.chargePerOrder){
      this.chargePerOrder=bres.chargePerOrder;
    this.orderShipCharge = bres.orderShipCharge;
    }
    if(bres.freeShip) {
      this.freeship = true
    }
    if(bres.chargePerProd){
      this.chargeperprod = true
    }
    
 }
  getColClass(col: string): string {
    if(col)
      return 'tooltip linkButtonBN ciccolchipBN ' + col.trim().toLowerCase().replace(/ /g, '') + 'CBN';
    
    return '';
  }

  isSysColor(col: string) {
    return this.utilsService.isSysColor(col);
  }

  init(res: Cart) {
    this.cart = res;
    this.cart.tShipping=this.getshippingPrice();
    this.cartService.broadcastCart();
    this.isLoaded = true;
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

    this.cart = this.cartService.setCartItemQuantity(this.merchantCode, item.productId, item.variantId, item.sizeId, newqty);
  }

  remove(p: CartItem) {
    this.cart = this.cartService.deleteFromCart(this.merchantCode, p.productId, p.variantId, p.sizeId);     
  }

  getTotalDiscount(): number {
    return this.getTotalPrice() - this.cartService.getCartTotal() ;
  }

  getTotalAmount(): number {
    return this.cartService.getCartTotal() + this.getshippingPrice();
  }

  getProductlink(id: string): string {
    return '/' + this.merchantCode + '/product/' + id;
  }

  getTotalPrice(): number {
    let tp: number = 0;
    if(this.cart && this.cart.items && this.cart.items.length > 0) {
      this.cart.items.forEach(function(i) {
        tp += i.origPrice * i.quantity;
      });
    }

    return tp;
  }
  getshippingPrice(){
    let shipping: number = 0;
    if(this.freeship){
      shipping = 0;
    }
    if(this.chargePerOrder){
      shipping = this.orderShipCharge;
    }
  else {
   console.log(this.chargeperprod );
     if(this.cart && this.cart.items && this.cart.items.length > 0 && this.chargeperprod ) {
      console.log(this.cart.items,'i');
      this.cart.items.forEach(function(i) {
       
        if(i.shippingcharge != null){
        let p : number ;
        p = parseInt(i.shippingcharge);
        shipping += p;
        }
      });
  }
}
console.log('shipping', shipping)
  return shipping;
}
}

