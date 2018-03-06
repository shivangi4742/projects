import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { Cart } from './../models/cart.model';
import { Product } from './../models/product.model';
import { Variant } from './../models/variant.model';
import { CartItem } from './../models/cartitem.model';

import { ProductService } from './product.service';

@Injectable()
export class CartService {
    private _cart: Cart;

    constructor(private productService: ProductService) { }

    private pushCartToLocalStorage(): any {
        var crt: any = {};
        if(this._cart) {
            crt.address = this._cart.address;
            crt.email = this._cart.email;
            crt.name = this._cart.name;
            crt.phone = this._cart.phone;
            if(this._cart.items && this._cart.items.length > 0) {
                crt.items = new Array();
                this._cart.items.forEach(function(ci) {
                    crt.items.push({
                        "pid": ci.productId,
                        "vid": ci.variantId,
                        "siz": ci.size,
                        "qty": ci.quantity
                    });
                })
            }
        }

        localStorage.setItem('bnHBSCart', crt);
    }

    public getCart(): Promise<Cart|null> {
        if(this._cart)
            return Promise.resolve(this._cart);

        let crt: any = localStorage.getItem('bnHBSCart');
        if(crt) {
            this._cart = new Cart(crt.name, crt.phone, crt.phone, crt.address, new Array<CartItem>());
            if(crt.items && crt.items.length > 0) {
                crt.items.forEach(function(ci: any) {
                    this._cart.items.push(new CartItem(ci.qty, ci.pid, '', 0, 0, '', ci.vid, ci.siz, '', '', ''));
                });

                return this.productService.fillCartItemsDetails(this._cart);
            }
            else
                return Promise.resolve(this._cart);
        }
        else
            return Promise.resolve(this._cart);
    }

    public setBuyerInfo(name: string, email: string, address: string, phone: string) {
        if(!this._cart)
            this._cart = new Cart(name, phone, email, address, new Array<CartItem>());
        else {
            this._cart.name = name;
            this._cart.email = email;
            this._cart.phone = phone;
            this._cart.address = address;
        }

        this.pushCartToLocalStorage();
    }

    public setCartItemQuantity(pid: string, vid: string, siz: string, qty: number) {
        if(qty > 0 && this._cart && this._cart.items && this._cart.items.length > 0) {
            let existingItem = this._cart.items.filter(ci => ci.productId == pid && ci.variantId == vid && 
                ci.sizeId == siz);
            if(existingItem && existingItem.length > 0) {
                existingItem[0].quantity = qty;
                this.pushCartToLocalStorage();
            }
        }        
    }

    public deleteFromCart(pid: string, vid: string, siz: string) {
        if(this._cart && this._cart.items && this._cart.items.length > 0) {
            this._cart.items = this._cart.items.filter(ci => !(ci.productId == pid && ci.variantId == vid && 
                ci.sizeId == siz));
            this.pushCartToLocalStorage();
        }
    }

    public addToCart(prod: Product, variant: string, size: string, qty: number) {
        if(qty > 0) {
            if(!this._cart)
                this._cart = new Cart('', '', '', '', new Array<CartItem>());
            
            if(!this._cart.items)
                this._cart.items = new Array<CartItem>();

            let existing: boolean = false;
            if(this._cart.items.length > 0) {
                let existingItem: Array<CartItem> = this._cart.items.filter(ci => ci.productId == prod.id && ci.variantId == variant && 
                    ci.sizeId == size);
                if(existingItem && existingItem.length > 0) {
                    existingItem[0].quantity += qty;
                    existing = true;
                }
            }

            if(!existing) {
                let c: string = prod.color;
                let s: string = size;
                if(prod.variants && prod.variants.length > 0 && variant != '-1') {
                    let selV: Variant = prod.variants.filter(v => v.id == variant)[0];
                    c = selV.color;
                }

                this._cart.items.push(new CartItem(qty, prod.id, prod.name, prod.originalPrice, prod.price, prod.imageURL, variant, size, c, s, 
                    prod.description));
                this.pushCartToLocalStorage();                
            }
        }
    }    
}