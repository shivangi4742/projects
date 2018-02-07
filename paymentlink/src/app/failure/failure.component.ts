import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { ProductService, Product, SDKService, SDK, TransactionService } from 'benowservices';

@Component({
  selector: 'failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.css']
})
export class FailureComponent implements OnInit {
  id: string;
  title: string;
  error: string;
  txnid: string;
  payLink: string;
  loaded: boolean = false;
  mtype: number = 1;
  constructor(private route: ActivatedRoute, private productService: ProductService, private sdkService: SDKService,
    private transactionService: TransactionService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.txnid = this.route.snapshot.params['txnid'];
    if(this.id && this.txnid) {
      this.payLink = '/pay/' + this.id;
      this.productService.getProductsForTransaction(this.id, this.txnid)
        .then(res => this.fillProducts(res));
    }
  }

  fillProducts(res: Array<Product>) {
    if(res && res.length > 0) {
      let input: Array<any> = new Array<any>();
      for(let i: number = 0; i < res.length; i++) {
          input.push({
            "id": res[i].id,
            "qty": res[i].qty
          });
      }

      this.payLink +=  '/' + btoa(JSON.stringify(input))
    }

    this.sdkService.getPaymentLinkDetails(this.id)
      .then(sres => this.getSDKDetailsForNonProduct(sres));
  }

  fillMerchantTransaction(res: any) {
    if(res && res.length > 0 && res[0].paymentStatus && res[0].paymentStatus.trim().toUpperCase() == 'FAILED')
      this.loaded = true;
  }

  getSDKDetailsForNonProduct(sres: SDK) {
    this.title = sres.businessName;
    this.mtype = sres.merchantType;
    if(this.mtype == 2) {
      if(this.payLink && this.payLink.trim().length > 0)
        this.payLink = this.payLink.replace('/pay/', '/donate/');
      else
        this.payLink = '/donate/' + this.id;
    }
      
    this.transactionService.getTransactionDetails(sres.merchantCode, this.txnid)
      .then(res => this.fillMerchantTransaction(res));
  }
}
