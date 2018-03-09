import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product, ProductService, StoreService } from 'benowservices';

@Component({
  selector: 'paymentsuccess',
  templateUrl: './paymentsuccess.component.html',
  styleUrls: ['./paymentsuccess.component.css']
})
export class PaymentsuccessComponent implements OnInit {
  id: string;
  homeLink: string;
  merchantCode: string;

  constructor(private productService: ProductService, private storeService: StoreService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    this.homeLink = '/' + this.merchantCode + '/store';
    this.storeService.assignMerchant(this.merchantCode);
    this.productService.getProductsForTransaction(null, this.id)
      .then(res => this.bindProds(res));
    //Clear Cart
  }

  bindProds(res: Array<Product>) {
    console.log(res);
  }

}
