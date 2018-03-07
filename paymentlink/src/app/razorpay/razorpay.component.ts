import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PG, SDKService, RazorPayModel, SDK, ProductService, Product, UtilsService } from "benowservices";
import { WindowRef } from "./../windowref.service";

import * as $ from 'jquery';
import { Subscription } from 'rxjs/Subscription';

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
  rzKey: string;
  // resdata: ResData;
  razorPayWebRequestUrl: string;
  // isData: boolean;
  subscription: Subscription;

  status: string;
  mode: string;
  amount: number;
  phone: string;
  udf4: string;
  udf3: string;
  mtype: number;
  paylinkid: string;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sdkService: SDKService,
    private productService: ProductService,
    private utilsService: UtilsService,
    private winRef: WindowRef,
    private cdref: ChangeDetectorRef
  ) {
    let me: any = this;
    this.subscription = this.sdkService.receivedPayment().subscribe(message => me.afterPayment(message));
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.txnId = this.route.snapshot.params['txnid'];
    this.prods = this.route.snapshot.params['prods'];

    this.status = "";
    this.mode = "";
    this.amount = 0;
    this.phone = "";
    this.udf4 = "";
    this.udf3 = "";
    this.paylinkid = "";

    // this.isData = false;

    if (this.id && this.id.length > 0) {
      this.pg = this.sdkService.getPG();
      this.sdkService.getPaymentLinkDetails(this.id)
        .then(res => this.getProducts(res));
    }
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
      this.rzModel = new RazorPayModel(res.amount, res.title, res.description, res.firstName, res.lastName, res.email);
      this.sdkService.getMerchantPaymentInfo(res.merchantCode, 'RAZORPAY')
        .then(res => this.processPaymentReq(res));

    }
  }

  processPaymentReq(res: any) {

    this.rzKey = res.merchantKey;

    this.options = this.getPaymentRequest();
    if (this.options) {
      this.initRazorPay();
    }
    else
      this.router.navigateByUrl('/notfound');
  }

  initRazorPay(): void {
    this.rzp1 = new this.winRef.nativeWindow.Razorpay(this.options);
    this.rzp1.open();
  }

  getPaymentRequest(): any {
    var me = this;
    var options = {
      "key": this.rzKey,
      "amount": this.rzModel.amount * 100,
      "name": this.rzModel.title,
      "description": this.rzModel.description,
      "image": this.pay.imageURL,
      "handler": function (response) {
        me.sdkService.setReceivedPaymentSubject(response);
      },
      "prefill": {
        "name": this.rzModel.firstName + " " + this.rzModel.lastName,
        "email": this.rzModel.email
      },
      "notes": {
        "merchantCode": this.pay.merchantCode,
        "merchantName": this.pay.businessName
      },
      "theme": {
        "color": "#E53935"
      }
    };

    return options;
  }

  afterPayment(response: any): void {
    this.sdkService.razorpayCapturePayment(response.razorpay_payment_id, this.txnId)
      .then(res => this.proceedToPaymentConfirmation(res))
  }

  proceedToPaymentConfirmation(res: any): void {

    var status = "Failed";
    if (res.status.toLowerCase() == 'captured') {
      status = "success";
    }

    var baseUrl = this.utilsService.getBaseURL();
    var surl = baseUrl + 'ppl/paymentsuccess/' + this.id + '/' + this.txnId;
    var furl = baseUrl + 'ppl/paymentfailure/' + this.id + '/' + this.txnId;

    if (this.pay.merchantType == 2) {
      // Confirm fundraiser logic
      if (res.hasfundraiser && res.hasfundraiser.toString().toLowerCase() == "true") {
        surl = baseUrl + 'ppl/donationsuccess/' + this.id + '/' + this.txnId + '/' + res.fundraiserid;
        furl = baseUrl + 'ppl/donationfailure/' + this.id + '/' + this.txnId + '/' + res.fundraiserid;
      }
      else {
        surl = baseUrl + 'ppl/donationsuccess/' + this.id + '/' + this.txnId;
        furl = baseUrl + 'ppl/donationfailure/' + this.id + '/' + this.txnId;
      }
    }

    if (status.toLowerCase() == 'success') {
      this.razorPayWebRequestUrl = surl;
    }
    else {
      this.razorPayWebRequestUrl = furl;
    }

    this.status = status;
    this.mode = "RAZORPAY";
    this.amount = (res.amount / 100);
    this.phone = res.contact;
    this.udf4 = res.notes.merchantCode;
    this.udf3 = res.notes.merchantName;
    this.mtype = this.pay.merchantType;
    this.paylinkid = this.id;

    this.cdref.detectChanges();

    var me = this;

    setTimeout(function () { me.submitForm(); }, 1000);

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
