import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PG, SDKService, RazorPayModel, SDK, ProductService, Product, UtilsService } from "benowservices";
import { WindowRef } from "./../windowref.service";


@Component({
  selector: 'app-razorpay',
  templateUrl: './razorpay.component.html',
  styleUrls: ['./razorpay.component.css']
})
export class RazorpayComponent implements OnInit {

  id: string;
  txnId: string;
  rzp1: any;
  options: any;
  rzModel: RazorPayModel;
  pg: PG;
  pay: SDK;
  prods: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sdkService: SDKService,
    private productService: ProductService,
    private utilsService: UtilsService,
    private winRef: WindowRef
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.txnId = this.route.snapshot.params['txnid'];
    this.prods = this.route.snapshot.params['prods'];

    if (this.id && this.id.length > 0) {
      this.pg = this.sdkService.getPG();
      console.log('PG before', this.pg);
      this.sdkService.getPaymentLinkDetails(this.id)
        .then(res => this.getProducts(res));
      // this.rzModel = this.sdkService.getRazorPay();
      // console.log('Razor pay model', this.rzModel);
      // this.init(this.sdkService.getRazorPay());
    }
  }

  getProducts(res: SDK): void {
    this.pay = res;
    console.log('this.pay', this.pay);
    this.productService.getProductsForCampaign(this.pay.merchantCode, this.id)
      .then(pres => this.initProds(pres));
  }

  initProds(res: Array<Product>) {
    console.log('product res', res);
    if (res && res.length > 0) {
      let selProds: any = JSON.parse(atob(this.prods));
      if (selProds && selProds.length > 0) {
        this.pay.products = new Array<Product>();
        for (let i: number = 0; i < selProds.length; i++) {
          for (let j: number = 0; j < res.length; j++) {
            if (res[j].id == selProds[i].id) {
              res[j].qty = selProds[i].qty;
              this.pay.products.push(res[j]);
              break;
            }
          }
        }
      }

      let total: number = 0;
      if (this.pay.products && this.pay.products.length > 0) {
        for (let i: number = 0; i < this.pay.products.length; i++) {
          if (this.pay.products[i].qty > 0) {
            total += this.pay.products[i].qty * this.pay.products[i].price;
          }
        }

        this.pay.amount = total;
      }

      this.init(this.pay);

    }
  }

  init(res: SDK) {
    console.log('Response', res);
    if (res) {
      this.rzModel = new RazorPayModel(res.amount * 100, res.title, res.description, res.firstName, res.lastName, res.email);
      console.log('Razor pay model', this.rzModel);
      this.options = this.getPaymentRequest();
      if (this.options) {
        console.log('Options', this.options);
        this.initRazorPay();
      }
    }
    else
      this.router.navigateByUrl('/notfound');
  }

  initRazorPay(): void {
    console.log('Here');
    console.log('SDK', this.rzModel);
    this.rzp1 = new this.winRef.nativeWindow.Razorpay(this.options);
    this.rzp1.open();
  }

  getPaymentRequest(): any {
    var me = this;
    var options = {
      "key": this.utilsService.getRazorPayKey(),
      "amount": this.rzModel.amount * 100,
      "name": this.rzModel.title,
      "description": this.rzModel.description,
      "image": "https://pbs.twimg.com/profile_images/915212352873578498/qa3oS9PZ.jpg",
      "handler": function (response) {
        console.log('response obj', response);
        me.afterPayment(response);
      },
      "prefill": {
        "name": this.rzModel.firstName + " " + this.rzModel.lastName,
        "email": this.rzModel.email
      },
      "notes": {
        "address": "Hello World"
      },
      "theme": {
        "color": "#E53935"
      }
    };

    return options;
  }

  afterPayment(response: any): void {
    console.log('payment ID', response.razorpay_payment_id);
    console.log('response obj', response);
  }

}
