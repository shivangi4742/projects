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
import { UtilsService } from './utils.service';

@Injectable()
export class CartService {
    private _cart: Cart;
    private _subject = new Subject<any>();
    private _urls: any = {
        startPaymentProcessURL: 'cart/startPaymentProcess'
    }

    constructor(private productService: ProductService, private utilsService: UtilsService, private http: Http) { }

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

    private clearItems(code: string, items: Array<CartItem>) {
        if(items && items.length > 0 && this._cart && this._cart.items && this._cart.items.length > 0) {
            for(let i: number = 0; i < items.length; i++) {
                let item: Array<CartItem> = this._cart.items.filter(ci => ci.quantity == items[i].quantity && ci.name == items[i].name 
                    && ci.offerPrice == items[i].offerPrice && ((!ci.color && !items[i].color) || ci.color == items[i].color)
                    && ((!ci.size && !items[i].size) || ci.size == items[i].size));
                if(item && item.length > 0)
                    this.deleteFromCart(code, item[0].productId, item[0].variantId, item[0].sizeId);
            }

            this.broadcastCart();
        }
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
                        "siz": ci.sizeId,
                        "qty": ci.quantity
                    });
                })
            }
        }

        localStorage.setItem('bnHBSCart' + code, JSON.stringify(crt));
    }

    public startPayUPaymentProcess(merchantName: string, amount: number): Promise<any> {
        let pt: string = '';
        if(this._cart.paymentMode == 'DC')
            pt = 'DEBIT_CARD';
        else if(this._cart.paymentMode == 'CC')
            pt = 'CREDIT_CARD';
        else if(this._cart.paymentMode == 'NB')
            pt = 'NET_BANKING';

        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.startPaymentProcessURL,
            JSON.stringify({
                "name": this._cart.name,
                "address": this._cart.address,
                "email": this._cart.email,
                "pin": this._cart.pin,
                "city": this._cart.city,
                "state": this._cart.state,
                "payamount": amount,
                "phone": this._cart.phone,
                "merchantcode": this._cart.merchantCode,
                "merchantname": merchantName,
                "paytype": pt,
                "products": this._cart.items
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());        
    }

    public startUPIPaymentProcess(merchantVPA: string, merchantName: string, amount: number): Promise<any> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.startPaymentProcessURL,
            JSON.stringify({
                "name": this._cart.name,
                "address": this._cart.address,
                "email": this._cart.email,
                "pin": this._cart.pin,
                "city": this._cart.city,
                "state": this._cart.state,
                "payamount": amount,
                "phone": this._cart.phone,
                "merchantcode": this._cart.merchantCode,
                "merchantname": merchantName,
                "merchantvpa": merchantVPA,
                "paytype": 'UPI_OTHER_APP',
                "products": this._cart.items
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());        
    }

    public startCashPaymentProcess(merchantname: string): Promise<any> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.startPaymentProcessURL,
            JSON.stringify({
                "name": this._cart.name,
                "address": this._cart.address,
                "email": this._cart.email,
                "pin": this._cart.pin,
                "city": this._cart.city,
                "state": this._cart.state,
                "payamount": this.getCartTotal(),
                "phone": this._cart.phone,
                "merchantcode": this._cart.merchantCode,
                "merchantname": merchantname,
                "paytype": 'CASH',
                "products": this._cart.items
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());        
    }

    public getCartTotal(): number {
        let ta: number = 0;
        if(this._cart && this._cart.items && this._cart.items.length > 0) {
            this._cart.items.forEach(function(i) {
                ta += i.offerPrice * i.quantity;
            });
        }

        return ta;    
    }

    public isCartPayable(): boolean {
        if(this._cart && this._cart.name && this._cart.name.trim().length > 0 && this._cart.email && this._cart.email.trim().length > 0
            && this._cart.phone && this._cart.phone.trim().length > 9 && this._cart.address && this._cart.address.trim().length > 0
            && this.getCartTotal() > 0)
            return true;
          
        return false;
    }

    public getCart(code: string): Promise<Cart|null> {
        if(this._cart)
            return Promise.resolve(this._cart);

        let crtstr: string|null = localStorage.getItem('bnHBSCart' + code);
        let crt: any;
        if(crtstr)
            crt = JSON.parse(crtstr);
            
        if(crt) {
            this._cart = new Cart(crt.name, crt.phone, crt.email, crt.address, new Array<CartItem>(), crt.merchantCode, crt.paymentMode,
                crt.pin, crt.city, crt.state);
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

    public setBuyerInfo(name: string, email: string, address: string, phone: string, merchantCode: string, pin: string, city: string, 
        state: string) {
        if(!this._cart)
            this._cart = new Cart(name, phone, email, address, new Array<CartItem>(), merchantCode, '', pin, city, state);
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
            this._cart = new Cart('', '', '', '', new Array<CartItem>(), merchantCode, paymentMode, '', '', '');
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

    public clearFromCart(code: string, items: Array<CartItem>) {
        this.getCart(code).then(res => this.clearItems(code, items));
    }

    public addToCart(code: string, prod: Product, variant: string, size: string, qty: number) {
        if(qty > 0) {
            if(!this._cart)
                this._cart = new Cart('', '', '', '', new Array<CartItem>(), prod.merchantCode, '', '', '', '');
            
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