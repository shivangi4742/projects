import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Product, SDKService, ProductService, SDK } from 'benowservices';

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
  loaded: boolean = false;

  constructor(private route: ActivatedRoute, private sdkService: SDKService, private productService: ProductService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.txnid = this.route.snapshot.params['txnid'];
    this.pay = this.sdkService.getPaySuccess();
    if(this.pay && this.pay.amount > 0) {
      this.products = this.pay.products;
      this.loaded = true;
    }
    else
      this.productService.getProductsForTransaction(this.id, this.txnid)
        .then(res => this.fillProducts(res));
  }

  assignSDKDetails(res: SDK) {
    if(res && res.id) {
      this.pay.title = res.businessName;
      this.loaded = true;
    }
  }

  fillProducts(res: Array<Product>) {
    let total: number = 0;
    if(res && res.length > 0) {
      this.products = res;
      for(let i: number = 0; i < this.products.length; i++)
        total += this.products[i].qty * this.products[i].price;
    }

    this.pay = {
      amount: total,
      title: '',
      txnid: this.txnid
    }
    this.sdkService.getPaymentLinkDetails(this.id)
      .then(sres => this.assignSDKDetails(sres));
  }
}
