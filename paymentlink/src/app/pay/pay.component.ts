import { Component, OnInit } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { SDK, SDKService, UtilsService, Product, ProductService, User, PayRequest, PG } from 'benowservices';

@Component({
  selector: 'pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  mode: number;
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
  lastName: string;
  firstName: string;
  panNumber: string;
  uploadsURL: string;
  mobileNumber: string;
  validationError: string;
  pay: SDK;
  loaded: boolean = false;
  resident: boolean = true;
  qrError: boolean = false;
  qrlError: boolean = false;
  isMobile: boolean = false;
  putFocus: boolean = false;
  isPolling: boolean = false;
  supportsCC: boolean = false;
  supportsDC: boolean = false;
  supportsNB: boolean = false;
  ccExpanded: boolean = false;
  dcExpanded: boolean = false;
  nbExpanded: boolean = false;
  qrExpanded: boolean = false;
  hasProducts: boolean = false;
  qrlExpanded: boolean = false;
  supportsUPI: boolean = false;
  appLaunched: boolean = false;
  invalidAmount: boolean = false;
  amountEditable: boolean = false;
  supportsSodexo: boolean = false;
  upiMode: number = 1;

  constructor(private sdkService: SDKService, private route: ActivatedRoute, private router: Router, private utilsService: UtilsService,
    private productService: ProductService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.prods = this.route.snapshot.params['prods'];
    this.uploadsURL = this.utilsService.getUploadsURL();
    this.isMobile = this.utilsService.isAnyMobile();
    this.sdkService.getPaymentLinkDetails(this.id)
      .then(res => this.init(res))
  }

  sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  init(res: SDK) {
    if(res && res.id) {
      this.pay = res;
      if(this.pay.mtype == 1) {
        this.pay.askmob = false;
        this.pay.mndmob = false
        this.mobileNumber = this.pay.phone;
      }
      else {
        this.pay.askmob = true;
        this.pay.mndmob = true;
      }
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

    if(this.pay.amount == 0)
      this.pay.amount = null;
    
    if(!this.pay.amount || this.pay.amount <= 0)
      this.amountEditable = true;    

    if(this.pay.merchantType == 1)
      this.mobileNumber = this.pay.phone;

    if (this.pay.supportedModes && this.pay.supportedModes.length > 0) {
      if (this.pay.supportedModes.indexOf('UPI') >= 0)
        this.supportsUPI = true;

      if (this.pay.supportedModes.indexOf('CC') >= 0)
        this.supportsCC = true;

      if (this.pay.supportedModes.indexOf('DC') >= 0)
        this.supportsDC = true;

      if (this.pay.supportedModes.indexOf('NB') >= 0)
        this.supportsNB = true;

      if (this.pay.supportedModes.indexOf('SODEXO') >= 0)
        this.supportsSodexo = true;
    }

    if (this.pay && this.pay.firstName && !this.pay.lastName && this.pay.firstName.indexOf(' ') > 0) {
      let s = this.pay.firstName.split(' ');
      if (s && s.length > 1) {
        this.pay.firstName = s[0];
        this.pay.lastName = s[1];
      }
    }

    this.loaded = true;
  }

  validateEmail(email: string) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validate(focus: boolean): boolean {
    if (!this.pay) {
      this.validationError = 'Please provide all valid inputs';
      if(this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('amount');
        if(elmnt)
          elmnt.focus();
      }
    }
    else if (!this.pay.amount || this.pay.amount < 0.01 || this.pay.amount > 9999999.99) {
      this.validationError = 'Please enter a valid amount';
      if(this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('amount');
        if(elmnt)
          elmnt.focus();
      }
    }
    else if (this.pay.askname && this.pay.mndname && (!this.name || this.name.trim().length <= 0)) {
      this.validationError = 'Please enter name to proceed';
      if(this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('name');
        if(elmnt)
          elmnt.focus();
      }
    }
    else if (this.pay.askmob && this.pay.mndmob && (!this.mobileNumber || this.mobileNumber.trim().length <= 0)) {
      this.validationError = 'Please enter mobile number to proceed';
      if(this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('mobileNumber');
        if(elmnt)
          elmnt.focus();
      }
    }
    else if (this.pay.askemail && this.pay.mndemail && (!this.pay.email || this.pay.email.trim().length <= 0
      || !this.validateEmail(this.pay.email.trim()))) {
      this.validationError = 'Please enter a valid email';
      if(this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('email');
        if(elmnt)
          elmnt.focus();
      }
    }
    else if (this.pay.askpan && this.pay.mndpan && this.pay.minpanamnt < this.pay.amount && (!this.panNumber || this.panNumber.trim().length <= 0)) {
      this.validationError = 'Please enter PAN number to proceed';
      if(this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('panNumber');
        if(elmnt)
          elmnt.focus();
      }
    }
    else if (this.pay.askadd && this.pay.mndaddress && (!this.address || this.address.trim().length <= 0)) {
      this.validationError = 'Please enter a valid Address';
      if(this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('address');
        if(elmnt)
          elmnt.focus();
      }
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
      this.upiURL = res;
      this.upiAmount = amnt;
    }
    else
      this.qrlError = true;
  }

  backFromApp() {
    this.appLaunched = false;
    setTimeout(function() {
      let elmnt: any = document.getElementById('address');
      if(elmnt)
        elmnt.focus();

      elmnt = document.getElementById('panNumber');
      if(elmnt)
        elmnt.focus();

      elmnt = document.getElementById('email');
      if(elmnt)
        elmnt.focus();

      elmnt = document.getElementById('mobileNumber');
      if(elmnt)
        elmnt.focus();

      elmnt = document.getElementById('name');
      if(elmnt)
        elmnt.focus();

      elmnt = document.getElementById('amount');
      if(elmnt)
        elmnt.focus();
    }, 100);
  }

  waitForUPIPayment() {
    this.appLaunched = true;
    if (!this.isPolling)
      this.poll();
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
        this.sdkService.startPaymentProcess(this.id, this.name, this.address, this.pay.email, this.mobileNumber, this.panNumber,
          this.resident, this.pay.amount, this.pay.phone, this.pay.merchantCode, this.pay.merchantVpa, this.pay.title, 0, this.pay.invoiceNumber,
          this.pay.til, this.pay.products)
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

  getArrow(exp: boolean): string {
    if(exp)
      return 'keyboard_arrow_up';
    else
      return 'keyboard_arrow_down';
  }

  checkMyPayment(rest: any) {
    let found: boolean = false;
    let me: any = this;    
    if(rest && rest.length > 0) {
      let res: any = rest[0];
      if(res && res.txnId == this.txnNo && res.paymentStatus) {
        if(res.paymentStatus.trim().toUpperCase() == 'PAID') {
          found = true;
          this.sdkService.setPaySuccess({ "amount": this.pay.amount, "title": this.pay.title, "mode": 0, "txnid": this.txnNo,
            "merchantCode": res.merchantCode, "payer": res.payer, "transactionDate": res.transactionDate, "products": this.pay.products });
          this.router.navigateByUrl('/paymentsuccess/' + this.id + '/' + this.txnNo);
        }
        else if(res.paymentStatus.trim().toUpperCase() == 'FAILED') {
          found = true;
          this.sdkService.setPayFailure({ "amount": this.pay.amount, "title": this.pay.title, "error": this.utilsService.returnGenericError().errMsg, 
            "mode": 0, "txnid": this.txnNo, "merchantCode": res.merchantCode, "payer": res.payer, "transactionDate": res.transactionDate, 
            "products": this.pay.products });
          this.router.navigateByUrl('/paymentfailure/' + this.id + '/' + this.txnNo);
        }
      }
    }

    if(!found)
      setTimeout(function() { me.poll(); }, 5000);
  }

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

  showQRLink() {
    this.putFocus = true;
    if (!this.qrlExpanded) {
      if (this.validate(true))
        this.refreshUPIAmount();
    }

    this.qrlExpanded = !this.qrlExpanded;
    this.qrExpanded = false;
  }

  showQR() {
    this.putFocus = true;
    if (!this.qrExpanded) {
      if (this.validate(true))
        this.refreshQRAmount();
    }

    this.qrExpanded = !this.qrExpanded;
    this.qrlExpanded = false;
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
        this.sdkService.startPaymentProcess(this.id, this.name, this.address, this.pay.email, this.mobileNumber, this.panNumber, 
          this.resident, this.pay.amount, this.pay.phone, this.pay.merchantCode, this.pay.merchantVpa, this.pay.title, 0, this.pay.invoiceNumber,
          this.pay.til, this.pay.products)
          .then(res => this.createQR(res));
    }
  }

  refreshAmount() {
    if (this.validate(false)) {
      if (this.qrlExpanded)
        this.refreshUPIAmount();
      else if (this.qrExpanded)
        this.refreshQRAmount();
      else if (this.ccExpanded) {
        let elmnt: any = document.getElementById('ccBtn');
        if(elmnt)
          elmnt.click();
      }
      else if (this.dcExpanded) {
        let elmnt: any = document.getElementById('dcBtn');
        if(elmnt)
          elmnt.click();
      }
      else if (this.nbExpanded) {
        let elmnt: any = document.getElementById('nbBtn');
        if(elmnt)
          elmnt.click();
      }
    }
  }

  setMode(mode: number) {
    if(mode == 1)
      this.ccExpanded = true;
    else if(mode == 2)
      this.dcExpanded = true;
    else if(mode == 3)
      this.nbExpanded = true;

    this.putFocus = true;
    if (this.validate(true)) {
      this.mode = mode;
      this.sdkService.startPaymentProcess(this.id, this.name, this.address, this.pay.email, this.mobileNumber, this.panNumber,
        this.resident, this.pay.amount, this.pay.phone, this.pay.merchantCode, this.pay.merchantVpa, this.pay.title, mode, this.pay.invoiceNumber,
        this.pay.til, this.pay.products)
        .then(res => this.goToPG(res));
    }
  }

  goToPG(res: any) {
    if (res && res.transactionRef) {
      if (this.name) {
        let sp = this.name.trim().split(' ');
        if (sp && sp.length > 0)
          this.firstName = sp[0];

        if (sp && sp.length > 1)
          this.lastName = sp[1];
      }

      this.sdkService.setPG(new PG(this.mode, this.pay.amount, this.pay.sourceId, this.utilsService.isAnyMobile() ? 1 : 0, this.pay.email, 
        this.pay.phone, this.mobileNumber, this.pay.title, res.transactionRef, this.pay.surl, this.pay.furl, this.lastName, this.id, this.firstName, 
        this.pay.merchantId, this.pay.merchantCode, this.pay.udf2, this.pay.udf3, this.pay.udf4, this.pay.udf5));
      this.router.navigateByUrl('/pg/' + this.id);
    }
    else {
      this.invalidAmount = true;
      this.validationError = 'Error in connecting payment gateway!';
    }
  }
}