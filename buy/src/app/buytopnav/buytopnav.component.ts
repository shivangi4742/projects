import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { StoreService } from 'benowservices';

@Component({
  selector: 'buytopnav',
  templateUrl: './buytopnav.component.html',
  styleUrls: ['./buytopnav.component.css']
})
export class BuytopnavComponent implements OnInit {
  numCartItems: number;
  storeHome: string;
  subscription: Subscription;

  constructor(private storeService: StoreService) { 
    let me: any = this; 
    this.subscription = this.storeService.homeAssigned().subscribe(message => me.storeHome = message);        
  }

  ngOnInit() {
  }
}
