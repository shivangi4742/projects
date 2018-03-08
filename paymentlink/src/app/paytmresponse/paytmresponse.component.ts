import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SDKService, SDK, ProductService, Product, UtilsService } from "benowservices";

@Component({
  selector: 'app-paytmresponse',
  templateUrl: './paytmresponse.component.html',
  styleUrls: ['./paytmresponse.component.css']
})
export class PaytmresponseComponent implements OnInit {

  id: string;
  pay: SDK;
  prods: string;

  status: string;
  mode: string;
  amount: number;
  phone: string;
  udf4: string;
  udf3: string;
  mtype: number;
  paylinkid: string;
  payWebRequestUrl: string;

  paytmResp: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sdkService: SDKService,
    private productService: ProductService,
    private utilService: UtilsService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.paytmResp = JSON.parse((document.getElementById('#paymentSuccessData') as HTMLInputElement).value);

    this.status = "";
    this.mode = "";
    this.amount = 0;
    this.phone = "";
    this.udf4 = "";
    this.udf3 = "";
    this.paylinkid = "";

    this.sdkService.getPaymentLinkDetails(this.id)
      .then(res => this.getProducts(res));
  }

  getProducts(res: SDK): void {
    this.pay = res;
    this.productService.getProductsForCampaign(this.pay.merchantCode, this.id)
      .then(pres => this.initProds(pres));
  }

  initProds(res: Array<Product>) {
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
    if (res) {
      if (this.paytmResp.status == 'TXN_SUCCESS') {
        this.status = 'success';
      }
      else {
        this.status = 'Failed';
      }
      this.mode = this.paytmResp.paymentMethod;
      this.amount = this.paytmResp.amount;
      this.phone = this.pay.phone;
      this.udf4 = this.pay.merchantCode;
      this.udf3 = this.pay.businessName;
      this.mtype = this.pay.merchantType;
      this.paylinkid = this.id;

      var baseUrl = this.utilService.getBaseURL();
      var surl = baseUrl + 'ppl/paymentsuccess/' + this.id;
      var furl = baseUrl + 'ppl/paymentfailure/' + this.id;

      var me = this;
      setTimeout(function () { me.submitForm(); }, 1000);

    }
    else
      this.router.navigateByUrl('/notfound');
  }

  submitForm(): void {
    let me = this;
    var btn = document.getElementById("submitButton")

    if (btn) {
      btn.click();
    }
    else
      setTimeout(function () { me.submitForm(); }, 100);
  }

}
