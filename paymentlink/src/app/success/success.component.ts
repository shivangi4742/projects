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
    //TODO: Get transaction details and status.
    this.productService.getProductsForTransaction(this.id, this.txnid)
      .then(res => this.fillProducts(res));
  }

  assignProductImages(res: Array<Product>) {
    if(res && res.length > 0 && this.products && this.products.length > 0) {
      for(let i: number = 0; i < this.products.length; i++) {
        for(let j: number = 0; j < res.length; j++) {
          if(this.products[i].id == res[j].id) {
            this.products[i].imageURL = res[j].imageURL;
            break;
          }
        }
      }
    }

    this.loaded = true;
  }

  assignSDKDetails(res: SDK) {
    if(res && res.id) {
      this.productService.getProductsForCampaign(res.merchantCode, this.id)
        .then(cres => this.assignProductImages(cres));

      this.pay.title = res.businessName;
    }
  }

  fillProducts(res: Array<Product>) {
    let total: number = 0;
    if(res && res.length > 0) {
      this.products = res;
      for(let i: number = 0; i < this.products.length; i++)
        total += this.products[i].qty * this.products[i].price;
    }

    this.sdkService.getPaymentLinkDetails(this.id)
      .then(sres => this.assignSDKDetails(sres));

    this.pay = {
      amount: total,
      title: '',
      mode: 1,
      txnid: this.txnid
    }
  }

  getPaymentModeString(m: number) {
    return 'Credit Card';
  }
}
