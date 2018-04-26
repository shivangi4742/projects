import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

import { Subscription } from 'rxjs/Subscription';
import { MaterializeAction } from 'angular2-materialize';

import { Cart, CartService, StoreService, SDKService, User, SocketService, PayRequest, UtilsService, PaymentlinkService } from 'benowservices';

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
  plInfo: any;
  supportsUPI: boolean = false;
  isPaymentlink: boolean = false;
  processing: boolean = false;
  modalActions: any = new EventEmitter<string | MaterializeAction>();

  constructor(private cartService: CartService, private router: Router, private storeService: StoreService, private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute, private sdkService: SDKService, private socketService: SocketService, 
    private sanitizer: DomSanitizer, private paymentlinkService: PaymentlinkService) { 
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
    if(this.settings.chargeConvenienceFee && this.cart.paymentMode != 'CASH') {
      if(this.isPaymentlink)
        return Math.round(this.plInfo.amount * 2.4)/100;
      else
        return Math.round(this.getTotalAmount() * 2.4)/100;
    }

    return 0;
  }

  getPayableAmount(): number {
    return this.getTotalAmount() + this.getConvenienceFee();
  }

  getTotalDiscount(): number {
    return this.getTotalPrice() - this.getTotalAmount();
  }

  getTotalAmount(): number {
    if(this.isPaymentlink)
      return this.plInfo.amount;
    else
      return this.cartService.getCartTotal();
  }

  sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  fillStoreSettings(res: any) {
    if(res) {
      this.settings = res;
      this.defaultVPA = this.getDefaultVPA();
      if(this.settings.acceptedPaymentMethods && this.settings.acceptedPaymentMethods.length > 0) {
        for(let i = 0; i < this.settings.acceptedPaymentMethods.length; i++) {
          if(this.settings.acceptedPaymentMethods[i].paymentMethod 
            && this.settings.acceptedPaymentMethods[i].paymentMethod.toLowerCase().indexOf('upi') >= 0) {
              this.supportsUPI = true;
              break;
            }
           
            if(this.settings.acceptedPaymentMethods[i].paymentMethod.toLowerCase().indexOf('cash') >= 0) {
              let em: any =  document.getElementById("cod");
              this.cart.paymentMode = "CASH";
              if(em)
                em.click();
               
            }
        }
      }
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
    if(this.room && res && res.data && res.out == true) {
      if(this.isPaymentlink) {
        this.closeModal();
        this.router.navigateByUrl('/paid/' + this.room);      
      }
      else
        this.router.navigateByUrl('/' + this.merchantCode + '/paymentsuccess/' + this.room);      
    }
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
    if(this.merchantCode) {
      this.storeService.assignMerchant(this.merchantCode);
      this.cartService.getCart(this.merchantCode)
        .then(res => this.fillCart(res));
  
      this.storeService.fetchStoreDetails(this.merchantCode)
        .then(res2 => this.fillStoreSettings(res2))  
    }
    else {
      this.plInfo = this.paymentlinkService.getPaymentlinkDetails();
      if(this.plInfo && this.plInfo.merchantCode) {          
        this.isPaymentlink = true;
        this.merchantCode = this.plInfo.merchantCode;
        this.cart = new Cart(this.plInfo.name, this.plInfo.phone, this.plInfo.email, this.plInfo.address, null, this.merchantCode, '');
        this.storeService.assignMerchant(this.merchantCode);
        this.storeService.fetchStoreDetails(this.merchantCode)
          .then(res2 => this.fillStoreSettings(res2))  
        if(this.utilsService.isAnyMobile())
          this.buildUPIURL();
      }
      else
        this.router.navigateByUrl('/');                 
    }
  }

  buildUPIURL() {
    if(this.cart && this.settings) {
      if(this.isPaymentlink) {
        let total: number = this.plInfo.amount + this.getConvenienceFee();
        total = Math.round(total * 100) / 100;
        this.paidAmount = total;  
        this.paymentlinkService.startUPIPaymentProcess(this.defaultVPA, this.settings.displayName, this.paidAmount)
          .then(res => this.getUPIURL(res));    
      }
      else {
        this.paidAmount = this.cartService.getCartTotal();
        if(this.settings.chargeConvenienceFee)
          this.paidAmount = Math.round(this.paidAmount * 102.36) / 100;  

        this.cartService.startUPIPaymentProcess(this.defaultVPA, this.settings.displayName, this.paidAmount)
          .then(res => this.getUPIURL(res));    
      }
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
      
    if (res && res.transactionRef) {
      if(this.isPaymentlink) {
        this.plInfo.transactionId = res.transactionRef;
        this.plInfo.convenienceFee = this.getConvenienceFee();
        this.plInfo.totalAmount = this.paidAmount;
        this.paymentlinkService.setPaymentlinkDetails(this.plInfo);
        this.router.navigateByUrl('/pg');            
      }
      else
        this.router.navigateByUrl('/' + this.merchantCode + '/pg/' + res.transactionRef + '/' + cf);            
    }
    else {
      this.processing = false;
      //handle error.
    }    
  }

  pay() {
    if(this.plInfo.amount > 0) {
      let total: number = this.plInfo.amount + this.getConvenienceFee();
      total = Math.round(total * 100) / 100;
      this.paidAmount = total;
      switch(this.plInfo.paymentMode) {
        case 'UPI':
          this.payRequest = null;
          this.paymentlinkService.startUPIPaymentProcess(this.defaultVPA, this.settings.displayName, total)
            .then(res => this.finishUPIPayment(res));
          break;
        case 'CC':
        case 'DC':
        case 'NB':
          this.paymentlinkService.startPayUPaymentProcess(this.settings.displayName, total)
            .then(res => this.finishPayUPayment(res))
          break;
        default:
          break;        
      }
    }
  }
  
  payForCart() {
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
    if(this.isPaymentlink) {
      this.plInfo.paymentMode = this.cart.paymentMode;
      this.paymentlinkService.setPaymentlinkDetails(this.plInfo);
      this.pay()
    }
    else {
      this.cartService.setPaymentMode(this.cart.paymentMode, this.merchantCode);
      this.payForCart();
    }
  }
}
