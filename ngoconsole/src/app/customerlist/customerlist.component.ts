import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { UserService, User, Customer, CustomerList } from 'benowservices';

@Component({
  selector: 'customerlist',
  templateUrl: './customerlist.component.html',
  styleUrls: ['./customerlist.component.css']
})
export class CustomerlistComponent implements OnInit {
  user: User;
  customer: Customer[];
  customerList: CustomerList;
  numPages: number;
  numCustomers: number;
  page: number = 2;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.userService.getUser()
      .then(res => this.init(res));
  }

  hasCustomer(): boolean {
    if(this.customer && this.customer.length > 0)
      return true;

    return false;
  }

  updateCustomerList(res: any) {
    console.log('',res)
    this.numCustomers = res.numCustomers;
    this.numPages = res.numPages;
    this.customer = res.customer;
    console.log('Custo', this.customer);
  }

  next() {
    this.customer = null;
    this.numPages = 0;
    window.scrollTo(0, 0);
    this.userService.getCustomerList(this.user.merchantCode, (++this.page))
      .then(res => this.updateCustomerList(res));
  }

  previous() {
    this.customer = null;
    this.numPages = 0;
    window.scrollTo(0, 0);
    this.userService.getCustomerList(this.user.merchantCode, (--this.page))
      .then(res => this.updateCustomerList(res));
  }

  init(res: any){
    this.user = res;

    console.log('user', this.user);

    this.userService.getCustomerList(this.user.merchantCode, this.page)
      .then(tres => this.updateCustomerList(tres));

  }

}
