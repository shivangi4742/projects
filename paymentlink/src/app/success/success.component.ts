import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Product, SDKService, ProductService, SDK, TransactionService } from 'benowservices';

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
  mtype: number = 1;

  constructor(private route: ActivatedRoute, private sdkService: SDKService, private productService: ProductService,
    private transactionService: TransactionService) { }

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
      this.mtype = res.merchantType;
      this.pay.title = res.businessName;
      this.loaded = true;
    }
  }

  getSDKDetailsForNonProduct(sres: SDK) {
    this.mtype = sres.merchantType;
    this.pay = {
      title: sres.businessName,
      txnid: this.txnid,
      amount: 0
    };
    this.transactionService.getTransactionDetails(sres.merchantCode, this.txnid)
      .then(res => this.fillMerchantTransaction(res));
  }

  fillMerchantTransaction(res: any) {
    if(res && res.length > 0 && res[0].paymentStatus && res[0].paymentStatus.trim().toUpperCase() == 'PAID')
      this.pay.amount = res[0].amount;

    this.loaded = true;
  }

  fillProducts(res: Array<Product>) {
    if(res && res.length > 0) {
      let total: number = 0;
      this.products = res;
      for(let i: number = 0; i < this.products.length; i++)
        total += this.products[i].qty * this.products[i].price;

      this.pay = {
        amount: total,
        title: '',
        txnid: this.txnid
      }
      this.sdkService.getPaymentLinkDetails(this.id)
        .then(sres => this.assignSDKDetails(sres));
    }
    else
      this.sdkService.getPaymentLinkDetails(this.id)
        .then(sres => this.getSDKDetailsForNonProduct(sres));
  }
}
