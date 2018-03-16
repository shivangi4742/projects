import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

import { Subscription } from 'rxjs/Subscription';
import { MaterializeAction } from 'angular2-materialize';

import { Cart, CartService, StoreService, SDKService, User, SocketService, PayRequest, UtilsService } from 'benowservices';

@Component({
  selector: 'paymentmode',
  templateUrl: './paymentmode.component.html',
  styleUrls: ['./paymentmode.component.css']
})
export class PaymentmodeComponent implements OnInit {
  paidAmount: number;
  room: string;
  upiURL: string;
  defaultVPA: string;
  merchantCode: string;
  cart: Cart;
  payRequest: PayRequest;
  subscription: Subscription;  
  settings: any;
  processing: boolean = false;
  modalActions: any = new EventEmitter<string | MaterializeAction>();

  constructor(private cartService: CartService, private router: Router, private storeService: StoreService, private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute, private sdkService: SDKService, private socketService: SocketService, private sanitizer: DomSanitizer) { 
    let me: any = this;
    this.subscription = this.socketService.receivedPayment().subscribe(message => me.receivedPayment(message));        
  }

  getTotalPrice(): number {
    let tp: number = 0;
    if(this.cart && this.cart.items && this.cart.items.length > 0) {
      this.cart.items.forEach(function(i) {
        tp += i.origPrice * i.quantity;
      });
    }

    return tp;
  }

  getConvenienceFee(): number {
    if(this.settings.chargeConvenienceFee && this.cart.paymentMode != 'CASH')
      return Math.round(this.getTotalAmount() * 2.36)/100;

    return 0;
  }

  getPayableAmount(): number {
    return this.getTotalAmount() + this.getConvenienceFee();
  }

  getTotalDiscount(): number {
    return this.getTotalPrice() - this.getTotalAmount();
  }

  getTotalAmount(): number {
    return this.cartService.getCartTotal();
  }

  sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  fillStoreSettings(res: any) {
    if(res) {
      this.settings = res;
      this.defaultVPA = this.getDefaultVPA();
    }
    else
      this.router.navigateByUrl('/' + this.merchantCode + '/cart');
  }

  fillCart(res: Cart) {
    if(res && res.items && res.items.length > 0) {
      this.cart = res;
      if(this.utilsService.isAnyMobile())
        this.buildUPIURL();
    }
    else
      this.router.navigateByUrl('/' + this.merchantCode + '/cart');
  }

  receivedPayment(res: any) {
    if(this.room && res && res.data && res.out == true)
      this.router.navigateByUrl('/' + this.merchantCode + '/paymentsuccess/' + this.room);      
  }

  getDefaultVPA(): string {
    if(this.settings && this.settings.accs && this.settings.accs.length > 0) {
      for(let i: number = 0; i < this.settings.accs.length; i++) {
        if(this.settings.accs[i].default_upi_account && this.settings.accs[i].paymentMethod && this.settings.accs[i].virtualAddress
          && this.settings.accs[i].paymentMethod.toUpperCase().indexOf('UPI') >= 0)
          return this.settings.accs[i].virtualAddress;
      }

      for(let i: number = 0; i < this.settings.accs.length; i++) {
        if(this.settings.accs[i].paymentMethod && this.settings.accs[i].virtualAddress
          && this.settings.accs[i].paymentMethod.toUpperCase().indexOf('UPI') >= 0)
          return this.settings.accs[i].virtualAddress;
      }
    }

    return '';
  }

  isUPIButton(): boolean {
    if(this.utilsService.isAnyMobile() && this.cart.paymentMode == 'UPI')
      return true;

    return false;
  }

  qRLinkShown(res: any, txnNo: string) {
    if (res) {
      this.upiURL = res;
      this.room = txnNo;
      this.socketService.joinTransactionRoom(txnNo);
    }
    else {
      //handle error.
    }
  }
  
  qRShown(res: any, txnNo: string) {
    if (res == true) {
      this.payRequest = this.sdkService.getLastBill();
      if(this.payRequest && this.payRequest.qrURL) {
        this.room = txnNo;
        this.socketService.joinTransactionRoom(txnNo);
        this.modalActions.emit({ action: "modal", params: ['open'] });  
      }
    }
    else {
      //handle error.
    }

    this.processing = false;
  }

  finishUPIPayment(res: any) {
    if (res && res.transactionRef)
      this.sdkService.createBill(this.paidAmount, this.defaultVPA, null, res.transactionRef, new User(null, null, null, null, null, null, null, null, 
        null, this.settings.mccCode, this.merchantCode, null, this.settings.displayName, null, null, null, null,null, null, null))
        .then(res2 => this.qRShown(res2, res.transactionRef));
    else {
      this.processing = false;
      //handle error.
    }
  }

  ngOnInit() {
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    this.storeService.assignMerchant(this.merchantCode);
    this.cartService.getCart(this.merchantCode)
      .then(res => this.fillCart(res));

    this.storeService.fetchStoreDetails(this.merchantCode)
      .then(res2 => this.fillStoreSettings(res2))
  }

  buildUPIURL() {
    if(this.cart && this.settings) {
      this.paidAmount = this.cartService.getCartTotal();
      if(this.settings.chargeConvenienceFee)
        this.paidAmount = Math.round(this.paidAmount * 102.36) / 100;

      this.cartService.startUPIPaymentProcess(this.defaultVPA, this.settings.displayName, this.paidAmount)
        .then(res => this.getUPIURL(res));    
    }
    else {
      let me: any = this;
      setTimeout(function() { me.buildUPIURL(); }, 100);
    }
  }

  getUPIURL(res: any) {
    if(res && res.transactionRef)
      this.sdkService.createBillString(this.paidAmount, null, res.transactionRef, new User(null, null, null, null, null, null, null, null, null, 
        this.settings.mccCode, this.merchantCode, null, this.settings.displayName, null, null, null, null,null, null, null))
        .then(res3 => this.qRLinkShown(res3, res.transactionRef));
  }

  codMarked(res: any) {
    if(res && res.txnRefNumber && res.transactionStatus && res.transactionStatus.trim().toLowerCase() == 'successful')
      this.router.navigateByUrl('/' + this.merchantCode + '/paymentsuccess/' + res.txnRefNumber);      
    else {
      //error handling.
    }

    this.processing = false;
  }

  finishCashPayment(res: any) {
    if (res && res.transactionRef)
      this.sdkService.saveCashPaymentSuccess(this.paidAmount, res.transactionRef, this.cart.phone, this.merchantCode, this.settings.displayName, '')
        .then(res2 => this.codMarked(res2));
    else {
      this.processing = false;
      //error handling.
    }
  }

  finishPayUPayment(res: any) {
    let cf: number = 0;
    if(this.settings.chargeConvenienceFee)
      cf = 1;
      
    if (res && res.transactionRef)
      this.router.navigateByUrl('/' + this.merchantCode + '/pg/' + res.transactionRef + '/' + cf);            
    else {
      this.processing = false;
      //handle error.
    }    
  }
  
  pay() {
    if(this.cartService.isCartPayable()) {
      this.paidAmount = this.cartService.getCartTotal();
      switch(this.cart.paymentMode) {
        case 'CASH':
          this.cartService.startCashPaymentProcess(this.settings.displayName)
            .then(res => this.finishCashPayment(res));
          break;
        case 'UPI':
          this.payRequest = null;
          if(this.settings.chargeConvenienceFee)
            this.paidAmount = Math.round(this.paidAmount * 102.36)/100;

          this.cartService.startUPIPaymentProcess(this.defaultVPA, this.settings.displayName, this.paidAmount)
            .then(res => this.finishUPIPayment(res));
          break;
        case 'CC':
        case 'DC':
        case 'NB':
          if(this.settings.chargeConvenienceFee)
            this.paidAmount = Math.round(this.paidAmount * 102.36) / 100;

          this.cartService.startPayUPaymentProcess(this.settings.displayName, this.paidAmount)
            .then(res => this.finishPayUPayment(res))
          break;
        default:
          break;
      }      
    }
  }

  closeModal() {
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }

  onSubmit() {
    this.processing = true;
    this.cartService.setPaymentMode(this.cart.paymentMode, this.merchantCode);
    this.pay();
  }
}
