import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { SDK, SDKService, UtilsService, Product, ProductService, User, PayRequest } from 'benowservices';

@Component({
  selector: 'pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  qrAmount: number;
  upiAmount: number;
  tr: string;
  id: string;
  name: string;
  prods: string;
  txnNo: string;
  qrURL: string;
  upiURL: string;
  address: string;
  panNumber: string;
  paylinkid: string;
  uploadsURL: string;
  mobileNumber: string;
  validationError: string;
  pay: SDK;
  loaded: boolean = false;
  resident: boolean = true;
  qrError: boolean = false;
  qrlError: boolean = false;
  isPolling: boolean = false;
  qrExpanded: boolean = false;
  hasProducts: boolean = false;
  qrlExpanded: boolean = false;
  invalidAmount: boolean = false;
  amountEditable: boolean = false;

  constructor(private sdkService: SDKService, private route: ActivatedRoute, private router: Router, private utilsService: UtilsService,
    private productService: ProductService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.prods = this.route.snapshot.params['prods'];
    this.uploadsURL = this.utilsService.getUploadsURL();
    this.sdkService.getPaymentLinkDetails(this.id)
      .then(res => this.init(res))
  }

  init(res: SDK) {
    if(res && res.id) {
      this.pay = res;
      if(this.prods && !(res.products && res.products.length > 0)) {
        this.productService.getProductsForCampaign(this.pay.merchantCode, this.id)
          .then(pres => this.initProds(pres));
      }
      else
        this.initialize();
    }
    else
      this.router.navigateByUrl('/notfound');      
  }

  initProds(res: Array<Product>) {
    if(res && res.length > 0) {
      let selProds: any = JSON.parse(atob(this.prods));
      if(selProds && selProds.length > 0) {
        this.pay.products = new Array<Product>();
        for(let i: number = 0; i < selProds.length; i++) {
          for(let j: number = 0; j < res.length; j++) {
            if(res[j].id == selProds[i].id) {
              res[j].qty = selProds[i].qty;
              this.pay.products.push(res[j]);
              break;
            }
          }
        }
      }
    }

    if(!this.pay.products || this.pay.products.length < 1)
      this.router.navigateByUrl('/buy/' + this.id + '/' + this.pay.merchantCode);
    else
      this.initialize();
  }

  initialize() {
    let total: number = 0;
    if(this.pay.products && this.pay.products.length > 0) {
      for(let i: number = 0; i < this.pay.products.length; i++){
        if(this.pay.products[i].qty > 0) {
          total += this.pay.products[i].qty * this.pay.products[i].price;
        }
      }

      this.pay.amount = total;
    }      

    if(!this.pay.amount || this.pay.amount <= 0)
      this.amountEditable = true;    

    this.loaded = true;
  }

  validateEmail(email: string) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validate(focus: boolean): boolean {
    if (!this.pay) {
      this.validationError = 'Please provide all valid inputs';
    }
    else if (!this.pay.amount || this.pay.amount < 0.01 || this.pay.amount > 9999999.99) {
      this.validationError = 'Please enter a valid amount';
    }
    else if (this.pay.askname && this.pay.mndname && (!this.name || this.name.trim().length <= 0)) {
      this.validationError = 'Please enter name to proceed';
    }
    else if (this.pay.askmob && this.pay.mndmob && (!this.mobileNumber || this.mobileNumber.trim().length <= 0)) {
      this.validationError = 'Please enter mobile number to proceed';
    }
    else if (this.pay.askemail && this.pay.mndemail && (!this.pay.email || this.pay.email.trim().length <= 0
      || !this.validateEmail(this.pay.email.trim()))) {
      this.validationError = 'Please enter a valid email';
    }
    else if (this.pay.askpan && this.pay.mndpan && this.pay.minpanamnt < this.pay.amount && (!this.panNumber || this.panNumber.trim().length <= 0)) {
      this.validationError = 'Please enter PAN number to proceed';
    }
    else if (this.pay.askadd && this.pay.mndaddress && (!this.address || this.address.trim().length <= 0)) {
      this.validationError = 'Please enter a valid Address';
    }
    else {
      this.invalidAmount = false;
      return true;
    }

    this.invalidAmount = true;
    return false;
  }

  qRLinkShown(res: string, amnt: number) {
    this.qrlError = false;
    if (res && amnt > 0) {
      /*      if(this.pay.sourceId > 0)
              this.upiURL = this.utilsService.getBaseURL() + 'redirect/' + encodeURIComponent(res);
            else*/
      this.upiURL = res;

      this.upiAmount = amnt;
    }
    else
      this.qrlError = true;
  }

  createQRL(out: any) {
    if(out && out.transactionRef) {
      this.tr = this.pay.invoiceNumber;
      this.txnNo = out.transactionRef; 
      this.sdkService.createBillString(this.pay.amount, this.pay.til, this.txnNo,
        new User(null, null, null, null, null,null, null, null, this.pay.mccCode, this.pay.merchantCode, null, this.pay.title, null, null, null))
        .then(res => this.qRLinkShown(res, this.pay.amount));
    }
    else {
      this.invalidAmount = true;
      this.validationError = this.utilsService.returnGenericError().errMsg;
    }
  }

  refreshUPIAmount() {
    this.invalidAmount = false;

    if (this.upiAmount != this.pay.amount) {
      this.upiURL = null;
      if(this.txnNo && this.txnNo.length > 0)
        this.createQRL({ "transactionRef": this.txnNo });
      else
        this.sdkService.startPaymentProcess(this.paylinkid, this.name, this.address, this.pay.email, this.mobileNumber, this.panNumber,
          this.resident, this.pay.amount, this.pay.phone, this.pay.merchantCode, this.pay.merchantVpa, this.pay.title, 0, this.pay.invoiceNumber,
          this.pay.til)
          .then(res => this.createQRL(res));
    }
    else
      this.qRLinkShown(this.upiURL, this.upiAmount);
  }

  poll() {
    if(window.location.href.indexOf('/pay/') > 1 || window.location.href.indexOf('/paysdk') > 1)
      this.sdkService.getTransactionStatus(this.pay.merchantCode, this.txnNo)
        .then(res => this.checkMyPayment(res));
  }

  checkMyPayment(res: any) {
/*     let me: any = this;
    let found: boolean = false;
    if(res && res.length > 0)
      res = res[0];

    let phoneStr: string = this.pay.phone;
    if(this.mobileNumber && this.mobileNumber.trim().length > 0)
      phoneStr = this.mobileNumber.trim();

    if(res && res.txnId == this.txnNo && res.paymentStatus) {
      if(res.paymentStatus.trim().toUpperCase() == 'PAID') {
        found = true;
        if(me.pay.sourceId >= 1 || (me.pay.surl && me.pay.surl.length > 4)) {
          let inpt: any = JSON.parse($('#paymentPageData').val());
          me.payService.setPGSDK(new PGSDK(null, me.address, null, me.pay.amount, null, null, null, null, null, null, null, me.pay.email, null,
            null, null, null, null, null, null, null, null, null, null, me.pay.firstName, me.pay.id, me.pay.lastName, me.pay.merchantCode, me.tr, 
            'UPI', null, me.pay.amount, me.paylinkid, 'UPI', 'UPI', phoneStr, me.pay.merchantCode, this.pay.sourceId, null, 'success',
            me.pay.title, me.txnNo, me.paylinkid, inpt.udf2, inpt.udf3, inpt.udf4, inpt.udf5, null, null, null, null, null, this.pay.surl, this.pay.furl,
            'success', null));
          me.router.navigateByUrl('/pgsdk/' + me.paylinkid);
        }
        else {
          me.payService.setPaySuccess({ "amount": me.pay.amount, "title": me.pay.title, "mode": 0, "txnid": this.txnNo });
          me.router.navigateByUrl('/paymentsuccess/' + me.paylinkid);
        }
      }
      else if(res.paymentStatus.trim().toUpperCase() == 'FAILED') {
        found = true;
        if(me.pay.sourceId >= 1 || (me.pay.surl && me.pay.surl.length > 4)) {
          let inpt: any = JSON.parse($('#paymentPageData').val());
          me.payService.setPGSDK(new PGSDK(null, me.address, null, me.pay.amount, null, null, null, null, null, null, null, me.pay.email, 
            'PAYMENT_ERROR', this.utilsService.returnGenericError().errMsg, null, null, null, null, null, null, null, null, null, me.pay.firstName, 
            me.pay.id, me.pay.lastName, me.pay.merchantCode, me.tr, 'UPI', null, me.pay.amount, me.paylinkid, 'UPI', 'UPI', phoneStr, 
            me.pay.merchantCode, this.pay.sourceId, null, 'failure', me.pay.title, me.txnNo, me.paylinkid, inpt.udf2, inpt.udf3, inpt.udf4, inpt.udf5, 
            null, null, null, null, null, this.pay.surl, this.pay.furl, 'failure', null));
          me.router.navigateByUrl('/pgsdk/' + me.paylinkid);
        }
        else {
          me.payService.setPayFailure({ "amount": me.pay.amount, "title": me.pay.title, "error": me.utilsService.returnGenericError().errMsg, 
            "mode": 0, "txnid": this.txnNo });
          me.router.navigateByUrl('/paymentfailure/' + me.paylinkid);
        }        
      }
    }

    if(!found)
      setTimeout(function() { me.poll(); }, 5000);
 */  }

  qRShown(res: boolean) {
    this.qrError = false;
    if (res == true) {
      this.qrAmount = this.pay.amount;
      let r: PayRequest = this.sdkService.getLastBill();
      if (r && r.qrURL)
        this.qrURL = r.qrURL;

      if (!this.isPolling)
        this.poll();
    }
    else
      this.qrError = true;
  }

  createQR(out: any) {
    if(out && out.transactionRef) {
      this.tr = this.pay.invoiceNumber;
      this.txnNo = out.transactionRef;
      this.sdkService.createBill(this.pay.amount, this.pay.merchantVpa, this.pay.til, this.txnNo,
        new User(null, null, null, null, null,null, null, null, this.pay.mccCode, this.pay.merchantCode, null, this.pay.title, null, null, null))
        .then(res => this.qRShown(res));
    }
    else {
      this.invalidAmount = true;
      this.validationError = this.utilsService.returnGenericError().errMsg;
    }
  }

  refreshQRAmount() {
    this.invalidAmount = false;
    if (this.qrAmount != this.pay.amount) {
      this.qrURL = null;
      if(this.txnNo && this.txnNo.length > 0)
        this.createQR({ "transactionRef": this.txnNo });
      else
        this.sdkService.startPaymentProcess(this.paylinkid, this.name, this.address, this.pay.email, this.mobileNumber, this.panNumber, 
          this.resident, this.pay.amount, this.pay.phone, this.pay.merchantCode, this.pay.merchantVpa, this.pay.title, 0, this.pay.invoiceNumber,
          this.pay.til)
          .then(res => this.createQR(res));
    }
  }

  refreshAmount() {
    if (this.validate(false)) {
      if (this.qrlExpanded)
        this.refreshUPIAmount();
      else if (this.qrExpanded)
        this.refreshQRAmount();
    }
  }
}