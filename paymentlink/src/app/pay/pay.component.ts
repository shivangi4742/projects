import { Component, OnInit, EventEmitter } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { MaterializeAction } from 'angular2-materialize';

import {
  RazorPayModel, SDK, SDKService, UtilsService, Product, ProductService, User, PayRequest, PG, Fundraiser, Status,
  SocketService
} from 'benowservices';
import { PaytmRequestModel } from 'benowservices/models/paytmrequest.model';

@Component({
  selector: 'pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  mode: number;
  convFee: number;
  qrAmount: number;
  upiAmount: number;
  purchaseAmount: number;
  tr: string;
  id: string;
  sdkId: string;
  name: string;
  prods: string;
  txnNo: string;
  qrURL: string;
  upiURL: string;
  address: string;
  lastName: string;
  firstName: string;
  panNumber: string;
  companyName: string;
  employeeId: string;
  uploadsURL: string;
  fundRaiserId: string;
  mobileNumber: string;
  validationError: string;
  amountValidationError: string;
  pay: SDK;
  subscription: Subscription;
  payAmount: number = null;
  fundraiser: Fundraiser;
  break: boolean = false;
  loaded: boolean = false;
  resident: boolean = true;
  qrError: boolean = false;
  qrlError: boolean = false;
  isMobile: boolean = false;
  putFocus: boolean = false;
  supportsCC: boolean = false;
  supportsDC: boolean = false;
  supportsNB: boolean = false;
  ccExpanded: boolean = false;
  dcExpanded: boolean = false;
  nbExpanded: boolean = false;
  sodexoExpanded: boolean = false;
  intPayExpanded: boolean = false;
  qrExpanded: boolean = false;
  supportsCOD: boolean = false;
  hasProducts: boolean = false;
  qrlExpanded: boolean = false;
  supportsUPI: boolean = false;
  appLaunched: boolean = false;
  invalidAmount: boolean = false;
  amountEditable: boolean = false;
  supportsSodexo: boolean = false;
  supportsRazorPay: boolean = false;
  wp: number = 1;
  upiMode: number = 1;
  numSupportedModes: number = 0;
  collapsibleActions: any = new EventEmitter<string | MaterializeAction>();

  foodAmount: number = 0; // for sodexo
  sodexoPaidAmount: number = 0; // for sodexo
  disableSodexo: boolean = false;
  disableSodexoText: boolean = false;
  askPanOrig: boolean = false;
  payModesOrig: Array<string>; 

  constructor(private sdkService: SDKService, private route: ActivatedRoute, private router: Router, private utilsService: UtilsService,
    private productService: ProductService, private sanitizer: DomSanitizer, private socketService: SocketService) {
    let me: any = this;
    this.subscription = this.socketService.receivedPayment().subscribe(message => me.receivedPayment(message));
  }

  fundRaised(res: any, res2: boolean) {
    this.sdkService.send80G(res.data.id, this.id);
    this.router.navigateByUrl('/donationsuccess/' + this.id + '/' + this.txnNo + '/' + this.fundRaiserId);
  }

  receivedPayment(res: any) {
    if (res && res.data && res.out == true) {
      this.sdkService.setPaySuccess({
        "amount": res.data.amount, "title": this.pay.businessName, "mode": 0, "txnid": res.data.id, "merchantCode": res.data.merchantcode,
        "payer": res.data.vpa, "transactionDate": res.data.dt, "products": this.pay.products, "mtype": this.pay.merchantType
      });
      if (this.pay.merchantType == 2) {
        if (this.fundRaiserId)
          this.sdkService.updateFundraiserCollection(res.data.amount, this.fundRaiserId, this.id, res.data.id)
            .then(res2 => this.fundRaised(res, res2));
        else {
          this.sdkService.send80G(res.data.id, this.id);
          this.router.navigateByUrl('/donationsuccess/' + this.id + '/' + this.txnNo);
        }
      }
      else
        this.router.navigateByUrl('/paymentsuccess/' + this.id + '/' + this.txnNo);
    }
  }

  getArrowDrop(): string {
    if (this.break)
      return 'arrow_drop_up';

    return 'arrow_drop_down';
  }

  breakdown() {
    this.break = !this.break;
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.prods = this.route.snapshot.params['prods'];
    this.sdkId = this.route.snapshot.params['sdkId'];
    this.fundRaiserId = this.route.snapshot.params['fund'];
    this.uploadsURL = this.utilsService.getUploadsURL();
    this.isMobile = this.utilsService.isAnyMobile();

    if (this.route.snapshot.params['amount']) {
      this.payAmount = JSON.parse(atob(this.route.snapshot.params['amount']));
    }

    if (this.sdkId && this.sdkId.length > 0) {
      this.sdkService.getLogById(this.sdkId)
        .then(res => this.init(res))
    }
    else {
      this.sdkService.getPaymentLinkDetails(this.id)
        .then(res => this.init(res))
    }

    if (this.fundRaiserId) {
      this.sdkService.getFundraiserDetails(this.fundRaiserId, this.id)
        .then(res => this.gotFundraiser(res));
    }
  }

  gotFundraiser(res: Fundraiser) {
    if (res && res.id > 0) {
      this.fundraiser = res;
    }
  }

  sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  init(res: SDK) {
    if (res && res.id) {
      this.pay = res;
      this.askPanOrig = this.pay.askpan;
      this.payModesOrig = this.pay.supportedModes;

      this.foodAmount = this.pay.foodAmount;
      this.sodexoPaidAmount = this.pay.sodexoAmount;


      if (this.sodexoPaidAmount) {

        // if (this.sodexoPaidAmount == this.foodAmount) // Uncomment this when 
        this.disableSodexo = true;
        this.disableSodexoText = true;

        this.pay.amount = res.amount - this.sodexoPaidAmount;

        if (this.pay.foodAmount > this.sodexoPaidAmount)
          this.pay.foodAmount = this.pay.foodAmount - this.sodexoPaidAmount;

      }

      if (this.pay.mtype == 1) {
        this.pay.askmob = false;
        this.pay.mndmob = false;
        this.mobileNumber = this.pay.phone;
      }
      else {
        this.pay.askmob = true;
        this.pay.mndmob = true;
      }
      if (this.prods && this.prods != '0' && !(res.products && res.products.length > 0)) {
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
    if (res && res.length > 0) {
      let selProds: any = JSON.parse(atob(this.prods));
      if (selProds && selProds.length > 0) {
        this.pay.products = new Array<Product>();
        for (let i: number = 0; i < selProds.length; i++) {
          for (let j: number = 0; j < res.length; j++) {
            if (res[j].id == selProds[i].id) {
              res[j].qty = selProds[i].qty;
              this.pay.products.push(res[j]);
              this.hasProducts = true;
              break;
            }
          }
        }
      }
    }

    if ((!this.pay.products || this.pay.products.length < 1) && !this.payAmount) {
      if (this.pay.mtype == 2) {
        this.router.navigateByUrl('/contribute/' + this.id + '/' + this.pay.merchantCode);
      }

      else
        this.router.navigateByUrl('/buy/' + this.id + '/' + this.pay.merchantCode);
    }
    else
      this.initialize();
  }

  proceed() {
    this.wp = 2;
    this.disableSodexoText = true;
  }

  initialize() {
    let total: number = 0;
    if (this.pay.products && this.pay.products.length > 0) {
      for (let i: number = 0; i < this.pay.products.length; i++) {
        if (this.pay.products[i].qty > 0) {
          total += this.pay.products[i].qty * this.pay.products[i].price;
        }
      }

      this.pay.amount = total;
    }

    if (this.payAmount && this.payAmount > 0)
      this.pay.amount = this.payAmount;

    if (this.pay.amount == 0)
      this.pay.amount = null;

    if (!this.pay.amount || this.pay.amount <= 0)
      this.amountEditable = true;

    if (this.pay.mtype == 3 && !this.amountEditable && this.pay.chargeConvenienceFee) {
      this.purchaseAmount = Math.round(this.pay.amount * 100) / 100;
      this.pay.amount = Math.round(this.pay.amount * 1.0236 * 100) / 100;
      this.convFee = this.pay.amount - this.purchaseAmount;
    }

    if (this.pay.merchantType == 1)
      this.mobileNumber = this.pay.phone;

    this.numSupportedModes = 0;
    this.refreshPaymentModes();

    if (this.pay && this.pay.firstName && !this.pay.lastName && this.pay.firstName.indexOf(' ') > 0) {
      let s = this.pay.firstName.split(' ');
      if (s && s.length > 1) {
        this.pay.firstName = s[0];
        this.pay.lastName = s[1];
      }
    }

    this.loaded = true;
    this.invokeIfModeGiven();
  }

  codMarked(res: any) {
    this.router.navigateByUrl('/paymentsuccess/' + this.id + '/' + this.txnNo);
  }

  getStatus(res: any): Status {
    return this.utilsService.getStatus();
  }

  getStatusMessage(): boolean {
    let st: Status = this.utilsService.getStatus();
    if (st && st.message)
      return true;

    return false;
  }

  finishCashPayment(res: any) {
    if (res && res.transactionRef) {
      this.txnNo = res.transactionRef;
      this.sdkService.saveCashPaymentSuccess(this.pay.amount, this.txnNo, this.mobileNumber, this.pay.merchantCode, this.pay.title, this.id)
        .then(res => this.codMarked(res));
    }
    else {
      this.utilsService.setStatus(true, false, this.utilsService.returnGenericError().errMsg);
      window.scrollTo(0, 0);
    }
  }

  payCash() {
    if (this.validate(true))
      this.sdkService.startPaymentProcess(this.employeeId, this.companyName, this.id, this.name, this.address, this.pay.email, this.mobileNumber, this.panNumber,
        this.resident, this.pay.amount, this.pay.phone, this.pay.merchantCode, this.pay.merchantVpa, this.pay.title, 5, this.pay.invoiceNumber,
        this.pay.til, this.pay.products)
        .then(res => this.finishCashPayment(res));
  }

  invokeIfModeGiven() {
    if (this.numSupportedModes == 1) {
      if (this.supportsUPI)
        this.pay.mode = 'UPI';
      else if (this.supportsCC)
        this.pay.mode = 'CC';
      else if (this.supportsDC)
        this.pay.mode = 'DC';
      else if (this.supportsNB)
        this.pay.mode = 'NB';
      else if (this.supportsCOD)
        this.pay.mode = 'CASH';
      else if (this.supportsSodexo)
        this.pay.mode = 'SODEXO';
      else if (this.supportsRazorPay)
        this.pay.mode = 'RAZORPAY';
    }

    if (this.pay.mode && (this.pay.mode == 'CC' || this.pay.mode == 'DC' || this.pay.mode == 'UPI' || this.pay.mode == 'NB' ||
      this.pay.mode == 'SODEXO' || this.pay.mode == 'RAZORPAY' || this.pay.mode == 'CASH')) {
      if (this.validate(false)) {
        let me: any = this;
        switch (this.pay.mode) {
          case 'UPI':
            setTimeout(function () { me.collapsibleActions.emit({ action: "collapsible", params: ['open', 0] }); }, 500);
            if (this.isMobile)
              this.showQRLink();
            else
              this.showQR();

            break;
          case 'CC':
            this.setMode(1);
            break;
          case 'DC':
            this.setMode(2);
            break;
          case 'NB':
            this.setMode(3);
            break;
          case 'CASH':
            break;
          case 'SODEXO':
            this.setMode(4);
            break;
          case 'RAZORPAY':
            this.setMode(6);
        }
      }
    }
  }

  validateEmail(email: string) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validate(focus: boolean): boolean {
    if (!this.pay) {
      this.validationError = 'Please provide all valid inputs';
      if (this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('amount');
        if (elmnt)
          elmnt.focus();
      }
    }
    else if (!this.pay.amount || (this.pay.amount < 10 && this.pay.merchantType == 3) || (this.pay.amount < 1 && this.pay.merchantType != 3) || this.pay.amount > 9999999.99) {
      this.validationError = 'Please enter a valid amount';
      if (this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('amount');
        if (elmnt)
          elmnt.focus();
      }
    }
    else if (this.pay.askname && this.pay.mndname && (!this.name || this.name.trim().length <= 0)) {
      this.validationError = 'Please enter name to proceed';
      if (this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('name');
        if (elmnt)
          elmnt.focus();
      }
    }
    else if (this.pay.askmob && this.pay.mndmob && (!this.mobileNumber || this.mobileNumber.trim().length <= 9)) {
      this.validationError = 'Please enter mobile number to proceed';
      if (this.pay.merchantType != 1 && !this.pay.readonlymob && this.mobileNumber && this.mobileNumber.trim().length <= 9)
        this.validationError = 'Mobile number should have at least 10 digits';

      if (this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('mobileNumber');
        if (elmnt)
          elmnt.focus();
      }
    }
    else if (this.pay.askemail && this.pay.mndemail && (!this.pay.email || this.pay.email.trim().length <= 0
      || !this.validateEmail(this.pay.email.trim()))) {
      this.validationError = 'Please enter a valid email';
      if (this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('email');
        if (elmnt)
          elmnt.focus();
      }
    }
    else if (this.pay.askpan && this.pay.mndpan && this.pay.minpanamnt < this.pay.amount && (!this.panNumber || this.panNumber.trim().length <= 0)) {
      this.validationError = 'Please enter PAN number to proceed';
      if (this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('panNumber');
        if (elmnt)
          elmnt.focus();
      }
    }
    else if (this.pay.askcompanyname && this.pay.mndcompanyname && (!this.companyName || this.companyName.trim().length <= 0)) {
      this.validationError = 'Please enter Company Name';
      if (this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('companyName');
        if (elmnt)
          elmnt.focus();
      }
    }
    else if (this.pay.askemployeeId && this.pay.mndemployeeId && (!this.employeeId || this.employeeId.trim().length <= 0)) {
      this.validationError = 'Please enter Employee Id';
      if (this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('employeeId');
        if (elmnt)
          elmnt.focus();
      }
    }
    else if (this.pay.askadd && this.pay.mndaddress && (!this.address || this.address.trim().length <= 0)) {
      this.validationError = 'Please enter address';
      if (this.putFocus) {
        this.putFocus = false;
        let elmnt: any = document.getElementById('address');
        if (elmnt)
          elmnt.focus();
      }
    }
    else if (this.pay.foodAmount && (!this.pay.sodexoAmount || this.pay.sodexoAmount == 0)) {
      if (this.pay.foodAmount > this.foodAmount) {
        this.amountValidationError = 'Food amount cannot be more than ₹ ' + this.foodAmount;
      }
      else {
        this.amountValidationError = "";
        return true;
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
    setTimeout(function () {
      let elmnt: any = document.getElementById('address');
      if (elmnt)
        elmnt.focus();

      elmnt = document.getElementById('panNumber');
      if (elmnt)
        elmnt.focus();

      elmnt = document.getElementById('email');
      if (elmnt)
        elmnt.focus();

      elmnt = document.getElementById('mobileNumber');
      if (elmnt)
        elmnt.focus();

      elmnt = document.getElementById('name');
      if (elmnt)
        elmnt.focus();

      elmnt = document.getElementById('amount');
      if (elmnt)
        elmnt.focus();
    }, 100);
  }

  waitForUPIPayment() {
    this.appLaunched = true;
    this.socketService.joinTransactionRoom(this.txnNo);
  }

  createQRL(out: any) {
    if (out && out.transactionRef) {
      this.tr = this.pay.invoiceNumber;
      this.txnNo = out.transactionRef;
      this.sdkService.createBillString(this.pay.amount, this.pay.til, this.txnNo,
        new User(null, null, null, null, null, null, null, null, null, this.pay.mccCode, this.pay.merchantCode, null, this.pay.title, null, null, null, null, null, null, null))
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
      this.sdkService.startPaymentProcess(this.employeeId, this.companyName, this.id, this.name, this.address, this.pay.email, this.mobileNumber, this.panNumber,
        this.resident, this.pay.amount, this.pay.phone, this.pay.merchantCode, this.pay.merchantVpa, this.pay.title, 0, this.pay.invoiceNumber,
        this.pay.til, this.pay.products)
        .then(res => this.createQRL(res));
    }
    else
      this.qRLinkShown(this.upiURL, this.upiAmount);
  }

  getArrow(exp: boolean): string {
    if (exp)
      return 'keyboard_arrow_up';
    else
      return 'keyboard_arrow_down';
  }

  qRShown(res: boolean) {
    this.qrError = false;
    if (res == true) {
      this.qrAmount = this.pay.amount;
      let r: PayRequest = this.sdkService.getLastBill();
      if (r && r.qrURL)
        this.qrURL = r.qrURL;

      this.socketService.joinTransactionRoom(this.txnNo);
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
    if (out && out.transactionRef) {
      this.tr = this.pay.invoiceNumber;
      this.txnNo = out.transactionRef;
      this.sdkService.createBill(this.pay.amount, this.pay.merchantVpa, this.pay.til, this.txnNo,
        new User(null, null, null, null, null, null, null, null, null, this.pay.mccCode, this.pay.merchantCode, null, this.pay.title, null, null, null, null, null, null, null))
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
      this.sdkService.startPaymentProcess(this.employeeId, this.companyName, this.id, this.name, this.address, this.pay.email, this.mobileNumber, this.panNumber,
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
        if (elmnt)
          elmnt.click();
      }
      else if (this.dcExpanded) {
        let elmnt: any = document.getElementById('dcBtn');
        if (elmnt)
          elmnt.click();
      }
      else if (this.nbExpanded) {
        let elmnt: any = document.getElementById('nbBtn');
        if (elmnt)
          elmnt.click();
      }
      else if (this.sodexoExpanded) {
        let elmnt: any = document.getElementById('sodexoPayBtn');
        if (elmnt)
          elmnt.click();
      }
      else if (this.intPayExpanded) {
        let elmnt: any = document.getElementById('razorPayBtn');
        if (elmnt)
          elmnt.click();
      }
    }
  }

  setMode(mode: number) {
    var initAmount = this.pay.amount;
    if (mode == 1)
      this.ccExpanded = true;
    else if (mode == 2)
      this.dcExpanded = true;
    else if (mode == 3)
      this.nbExpanded = true;
    else if (mode == 4) {
      initAmount = this.pay.foodAmount;
      if (this.disableSodexo) {
        this.invalidAmount = true;
        this.validationError = 'Cannot proceed via Sodexo';
      }
      else {
        this.sodexoExpanded = true;
      }
    }
    else if (mode == 5) {
      this.intPayExpanded = true;
    }
    else if (mode == 6) {
      this.sdkService.setRazorPay(new RazorPayModel(initAmount, this.pay.title, this.pay.description, this.pay.firstName, this.pay.lastName, this.pay.email));
    }

    this.putFocus = true;
    if (this.validate(true)) {
      this.mode = mode;
      this.sdkService.startPaymentProcess(this.employeeId, this.companyName, this.id, this.name, this.address, this.pay.email, this.mobileNumber, this.panNumber,
        this.resident, initAmount, this.pay.phone, this.pay.merchantCode, this.pay.merchantVpa, this.pay.title, mode, this.pay.invoiceNumber,
        this.pay.til, this.pay.products)
        // .then(res => this.goToPG(res));
        .then(res => this.checkForPG(res, mode));
    }
  }

  /**
   * This function will check for PG, if null then default is PAYU biz
   * @author Hari
   */
  checkForPG(initPaymentRes: any, paymentMode: number) {
    var paymentMethodType: string;

    switch (paymentMode) {
      case 1:
        paymentMethodType = 'CREDIT_CARD';
        break;
      case 2:
        paymentMethodType = 'DEBIT_CARD';
        break;
      case 3:
        paymentMethodType = 'NET_BANKING';
        break;
      case 4:
        paymentMethodType = 'SODEXO';
        break;
      case 6:
        paymentMethodType = 'RAZORPAY';
        break;

      default:
        break;
    }

    this.sdkService.getMerchantPaymentInfo(this.pay.merchantCode, paymentMethodType)
      .then(res => this.hasOtherPg(res, initPaymentRes, paymentMode));
  }

  hasOtherPg(res: any, initPaymentRes: any, paymentMode: number) {
    if (res && res.paymentGateway) {
      if (res.paymentGateway == 'PAYTM') {

        var callbackUrl = this.utilsService.getBaseURL() + 'ppl/paytmresponse/' + this.id + '/' + initPaymentRes.transactionRef;
        var paymentModeOnly = '';
        var authMode = '';

        if (paymentMode == 1) {
          paymentModeOnly = 'CC';
          authMode = '3D';
        }
        else if (paymentMode == 2) {
          paymentModeOnly = 'DC';
          authMode = '3D';
        }
        else if (paymentMode == 3) {
          paymentModeOnly = 'NB';
          authMode = 'USRPWD';
        }

        var invoiceNumber = this.pay.invoiceNumber.replace(/ +/g, "");
        invoiceNumber = invoiceNumber.replace(',', "");
        this.sdkService.setPaytmRequest(new PaytmRequestModel(
          'DEFAULT', res.mId, initPaymentRes.transactionRef, invoiceNumber,
          this.pay.amount, 'WEB', 'BFSI', 'FullerWEB', '', +this.pay.phone, this.pay.email,
          'YES', authMode, paymentModeOnly, '', '', '', '', '', '', '', '', '', '', '',
          '', '', callbackUrl, ''
        ));

        this.router.navigateByUrl('/paytmrequest/' + this.id);
      }
      else if (res.paymentGateway == 'RAZORPAY') {
        this.goToPG(initPaymentRes);
      }
      else if (paymentMode == 4) {
        // var sodexoFurl = this.utilsService.getBaseURL() + 'ppl/sodexofailure/' + this.pay.merchantCode + '/' + this.mobileNumber;
        var sodexoFurl = this.utilsService.getBaseURL() + 'ppl/sodexofailure/' + this.pay.merchantCode + '/' + this.mobileNumber + '/' + this.id;
        var sodexoSurl = this.utilsService.getBaseURL() + 'ppl/sodexosuccess/' + this.pay.merchantCode + '/' + this.mobileNumber + '/' + this.id;

        var foodAmount = this.pay.foodAmount;
        var linkAmount = this.pay.amount;

        if (foodAmount == linkAmount) { // Full payment done via sodexo
          sodexoSurl = this.utilsService.getBaseURL() + 'ppl/sodexosuccess/' + this.pay.merchantCode + '/' + this.mobileNumber + '/' + this.id + '/' + initPaymentRes.transactionRef;
          sodexoFurl = this.utilsService.getBaseURL() + 'ppl/sodexofailure/' + this.pay.merchantCode + '/' + this.mobileNumber + '/' + this.id + '/' + initPaymentRes.transactionRef;
        }

        this.sdkService.createSodexoTransaction(initPaymentRes.transactionRef, this.pay.foodAmount + '', 'INR', '123565', res.mId, res.tId, 'FOOD', sodexoFurl, sodexoSurl)
          .then(res => this.goToSodexo(res));
      }
      else {
        this.goToPG(initPaymentRes);
      }
    }
    else {
      this.goToPG(initPaymentRes);
    }
  }

  goToSodexo(res: any) {
    if (res && res.redirectUserTo) {
      document.location.href = res.redirectUserTo;
    }
  }

  goToPG(res: any) {
    if (res && res.pgtype && res.pgtype.length > 0) {

    }
    else if (res && res.transactionRef) {
      if (this.name) {
        let sp = this.name.trim().split(' ');
        if (sp && sp.length > 0)
          this.firstName = sp[0];

        if (sp && sp.length > 1)
          this.lastName = sp[1];
      }

      let hasFundraiser: boolean = false;
      if (this.fundraiser && this.fundraiser.id)
        hasFundraiser = true;

      this.sdkService.setPG(new PG(this.mode, this.pay.amount, this.pay.sourceId, this.utilsService.isAnyMobile() ? 1 : 0, this.pay.email,
        this.pay.phone, this.mobileNumber, this.pay.title, res.transactionRef, this.pay.surl, this.pay.furl, this.lastName, this.id, this.firstName,
        this.pay.merchantId, this.pay.merchantCode, this.pay.udf2, this.pay.udf3, this.pay.udf4, this.pay.udf5, this.pay.merchantType, hasFundraiser,
        this.fundRaiserId));

      if (this.prods && this.prods.length > 0) {
        this.router.navigateByUrl('/pg/' + this.id + '/' + this.prods);
      }
      else {
        this.router.navigateByUrl('/pg/' + this.id);
      }

    }
    else {
      this.invalidAmount = true;
      this.validationError = 'Error in connecting payment gateway!';
    }
  }

  residentTypeChanged(type) {
    if (type.toLowerCase() == 'indian') {
      this.pay.askpan = this.askPanOrig;
      this.pay.supportedModes = this.payModesOrig;
      this.resident = true;
      this.refreshPaymentModes();
    }
    else {
      let modes: Array<string> = new Array<string>();
      modes.push('RAZORPAY');
      this.pay.askpan = false;
      this.pay.supportedModes = modes;
      this.resident = false;
      this.refreshPaymentModes();
    }
  }

  refreshPaymentModes(): void {
    if (this.pay.supportedModes && this.pay.supportedModes.length > 0) {
      if (this.pay.supportedModes.indexOf('UPI') >= 0) {
        this.supportsUPI = true;
        this.numSupportedModes++;
      }
      else {
        this.supportsUPI = false;
      }

      if (this.pay.supportedModes.indexOf('CC') >= 0) {
        this.numSupportedModes++;
        this.supportsCC = true;
      }
      else {
        this.supportsCC = false;
      }

      if (this.pay.supportedModes.indexOf('DC') >= 0) {
        this.numSupportedModes++;
        this.supportsDC = true;
      }
      else {
        this.supportsDC = false;
      }

      if (this.pay.supportedModes.indexOf('NB') >= 0) {
        this.numSupportedModes++;
        this.supportsNB = true;
      }
      else {
        this.supportsNB = false;
      }

      if (this.pay.supportedModes.indexOf('CASH') >= 0) {
        this.numSupportedModes++;
        this.supportsCOD = true;
      }
      else {
        this.supportsCOD = false;
      }

      if (this.pay.supportedModes.indexOf('SODEXO') >= 0) {
        this.numSupportedModes++;
        this.supportsSodexo = true;
      }
      else {
        this.supportsSodexo = false;
      }

      if (this.pay.supportedModes.indexOf('RAZORPAY') >= 0) {
        this.numSupportedModes++;
        this.supportsRazorPay = true;
      }
      else {
        this.supportsRazorPay = false;
      }

    }
  }

}
