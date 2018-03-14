import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { StoreService, CartService, Cart } from 'benowservices';
@Component({
  selector: 'leftnav',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.css']
})
export class LeftnavComponent implements OnInit {
  location: string = 'store';
  subs: Subscription;
  merchantCode: string;
  storeHome: string;
  cartLink: string;
  reprtlink: string;
  constructor(private storeService: StoreService) { let me: any = this; 
    this.subs= this.storeService.merchantAssigned().subscribe(message => me.rep(message));}

  ngOnInit() {
  }

  goto(loc: string) {

  }
  rep(mcode:string){
    this.merchantCode = mcode;
    if(this.merchantCode) {
      this.storeHome = '/' + this.merchantCode + '/store';
      this.cartLink =  '/' + this.merchantCode + '/cart';
      this.reprtlink = '/' + this.merchantCode + '/reporterror';
    }
  }
}
