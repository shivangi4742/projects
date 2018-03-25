import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { MaterializeAction } from 'angular2-materialize';

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
  reprtlink: string;
  merchantCode: string;
  subscription: Subscription;
  subscription2: Subscription;
  storeName:string;
  showStoreHomeLink: boolean = true;
  showReportErrorLink: boolean = true;
  reporterr: any = new EventEmitter<string|MaterializeAction>();
 
  constructor(private storeService: StoreService, private cartService: CartService, private router: Router,
   private activatedRoute: ActivatedRoute,) { 
    let me: any = this; 
    this.subscription = this.cartService.numItemsChanged().subscribe(message => me.numCartItems = message);    
    this.subscription2 = this.storeService.merchantAssigned().subscribe(message => me.assignLinks(message));   
  }
    
  fillStoreDetails(res: any) {
    if(res && res.id) {
      this.storeName = res.displayName;
    }
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
      this.reprtlink = '/' + this.merchantCode + '/reporterror';
      if(!this.storeName)
        this.storeService.fetchStoreDetais(this.merchantCode)
          .then(res => this.fillStoreDetails(res));
          
      if(window && window.location && window.location.href && window.location.href.indexOf('/store') > 0)
        this.showStoreHomeLink = false;
      else
        this.showStoreHomeLink = true;

      if(window && window.location && window.location.href && window.location.href.indexOf('/reporterror') > 0)
        this.showReportErrorLink = false;
      else
        this.showReportErrorLink = true;

      if(!(window && window.location && window.location.href && (window.location.href.indexOf('/cart') > 0 ||
        window.location.href.indexOf('/paymentsuccess/') > 0)))
        this.cartService.getCart(this.merchantCode)
          .then(res => this.cartFilled(res));
    }
  }
 ngOnInit(){

 }
}
