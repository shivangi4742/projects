import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

import { Size } from './../models/size.model';
import { Cart } from './../models/cart.model';
import { Product } from './../models/product.model';
import { Variant } from './../models/variant.model';
import { CartItem } from './../models/cartitem.model';

import { ProductService } from './product.service';

@Injectable()
export class CartService {
    private _cart: Cart;
    private _subject = new Subject<any>();

    constructor(private productService: ProductService) { }

    public numItemsChanged(): Observable<any> {
        return this._subject.asObservable();        
    }

    public broadcastCart() {
        this._subject.next(this.numCartItems());
    }

    private numCartItems(): number {
        if(this._cart && this._cart.items && this._cart.items.length > 0)
            return this._cart.items.length;

        return 0;
    }

    private pushCartToLocalStorage(code: string): any {
        var crt: any = {};
        if(this._cart) {
            crt.address = this._cart.address;
            crt.email = this._cart.email;
            crt.name = this._cart.name;
            crt.phone = this._cart.phone;
            crt.merchantCode = this._cart.merchantCode;
            crt.paymentMode = this._cart.paymentMode;
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

        localStorage.setItem('bnHBSCart' + code, JSON.stringify(crt));
    }

    public getCart(code: string): Promise<Cart|null> {
        if(this._cart)
            return Promise.resolve(this._cart);

        let crtstr: string|null = localStorage.getItem('bnHBSCart' + code);
        let crt: any;
        if(crtstr)
            crt = JSON.parse(crtstr);
            
        if(crt) {
            this._cart = new Cart(crt.name, crt.phone, crt.phone, crt.address, new Array<CartItem>(), crt.merchantCode, crt.paymentMode);
            if(crt.items && crt.items.length > 0) {
                let me: any = this;
                crt.items.forEach(function(ci: any) {
                    me._cart.items.push(new CartItem(ci.qty, ci.pid, '', 0, 0, '', ci.vid, ci.siz, '', '', ''));
                });

                return this.productService.fillCartItemsDetails(this._cart);
            }
            else
                return Promise.resolve(this._cart);
        }
        else
            return Promise.resolve(this._cart);
    }

    public setBuyerInfo(name: string, email: string, address: string, phone: string, merchantCode: string) {
        if(!this._cart)
            this._cart = new Cart(name, phone, email, address, new Array<CartItem>(), merchantCode, '');
        else {
            this._cart.name = name;
            this._cart.email = email;
            this._cart.phone = phone;
            this._cart.address = address;
        }

        this.pushCartToLocalStorage(merchantCode);
    }

    public setPaymentMode(paymentMode: string, merchantCode: string) {
        if(!this._cart)
            this._cart = new Cart('', '', '', '', new Array<CartItem>(), merchantCode, paymentMode);
        else
            this._cart.paymentMode = paymentMode;

        this.pushCartToLocalStorage(merchantCode);
    }

    public setCartItemQuantity(code: string, pid: string, vid: string, siz: string, qty: number) {
        if(qty > 0 && this._cart && this._cart.items && this._cart.items.length > 0) {
            let existingItem = this._cart.items.filter(ci => ci.productId == pid && ci.variantId == vid && 
                ci.sizeId == siz);
            if(existingItem && existingItem.length > 0) {
                existingItem[0].quantity = qty;
                this.pushCartToLocalStorage(code);
            }
        }
        
        return this._cart;
    }

    public deleteFromCart(code: string, pid: string, vid: string, siz: string): Cart {
        if(this._cart && this._cart.items && this._cart.items.length > 0) {
            this._cart.items = this._cart.items.filter(ci => !(ci.productId == pid && ci.variantId == vid && 
                ci.sizeId == siz));
            this.pushCartToLocalStorage(code);
        }

        this._subject.next(this.numCartItems());
        return this._cart;
    }

    public addToCart(code: string, prod: Product, variant: string, size: string, qty: number) {
        if(qty > 0) {
            if(!this._cart)
                this._cart = new Cart('', '', '', '', new Array<CartItem>(), prod.merchantCode, '');
            
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
                let c: string = '';
                let s: string = '';
                if(prod.variants && prod.variants.length > 0 && variant != '-1') {
                    let selV: Array<Variant> = prod.variants.filter(v => v.id == variant);
                    if(selV && selV.length > 0) {
                        c = selV[0].color;
                        if(selV[0].sizes && (selV[0].sizes as any).length > 0) {
                            for(let i: number = 0; i < (selV[0].sizes as any).length; i++) {
                                if((selV[0].sizes as any)[i].id == size) {
                                    s = (selV[0].sizes as any)[i].size;
                                    break;
                                }
                            }
                        }
    
                        this._cart.items.push(new CartItem(qty, prod.id, prod.name, prod.originalPrice, prod.price, prod.imageURL, variant, size, 
                            c, s, prod.description));                        
                    }
                }
                else {
                    c = prod.color;
                    if(prod.sizes && prod.sizes.length > 0) {
                        let selS: Array<Size> = prod.sizes.filter(s => s.id == size);
                        if(selS && selS.length > 0)
                            s = selS[0].size;
                    }
                    
                    this._cart.items.push(new CartItem(qty, prod.id, prod.name, prod.originalPrice, prod.price, prod.imageURL, variant, size, c, s, 
                        prod.description));                
                }
            }

            this._subject.next(this.numCartItems());
            this.pushCartToLocalStorage(code);                
        }
    }    
}