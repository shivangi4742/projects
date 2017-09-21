import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Product, SDKService, ProductService } from 'benowservices';

@Component({
  selector: 'success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  id: string;
  txnid: string;
  products: Array<Product>;
  pay: any;

  constructor(private route: ActivatedRoute, private sdkService: SDKService, private productService: ProductService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.txnid = this.route.snapshot.params['txnid'];
    //TODO: Get transaction details and status.
    this.productService.getProductsForTransaction(this.id, this.txnid)
      .then(res => this.fillProducts(res));
  }

  fillProducts(res: Array<Product>) {
    console.log(res);
    let total: number = 0;
    if(res && res.length > 0) {
      this.products = res;
      for(let i: number = 0; i < this.products.length; i++)
        total += this.products[i].qty * this.products[i].price;
    }

    this.pay = {
      amount: total,
      title: 'dummy',
      mode: 1,
      txnid: this.txnid
    }
  }

  getPaymentModeString(m: number) {
    return 'Credit Card';
  }
}
