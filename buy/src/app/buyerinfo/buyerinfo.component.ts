import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

import { Subscription } from 'rxjs/Subscription';
import { MaterializeAction } from 'angular2-materialize';

import { Cart, CartService, StoreService, SDKService, User, SocketService, PayRequest, UtilsService, PaymentlinkService } from 'benowservices';

@Component({
  selector: 'buyerinfo',
  templateUrl: './buyerinfo.component.html',
  styleUrls: ['./buyerinfo.component.css']
})
export class BuyerinfoComponent implements OnInit {
  paidAmount: number;
  pin: string;
  city: string;
  state: string;
  room: string;
  upiURL: string;
  prevPIN: string;
  errorMsg: string;
  defaultVPA: string;
  merchantCode: string;
  cart: Cart;
  payRequest: PayRequest;
  subscription: Subscription;  
  settings: any;
  plInfo: any;
  processing: boolean = false;
  isPaymentlink: boolean = false;
  modalActions: any = new EventEmitter<string | MaterializeAction>();

  constructor(private cartService: CartService, private router: Router, private activatedRoute: ActivatedRoute, private storeService: StoreService,
    private sdkService: SDKService, private socketService: SocketService, private utilsService: UtilsService, private sanitizer: DomSanitizer,
    private paymentlinkService: PaymentlinkService) { 
    let me: any = this;
    this.subscription = this.socketService.receivedPayment().subscribe(message => me.receivedPayment(message));  
  }

  sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  receivedPayment(res: any) {
    if(this.room && res && res.data && res.out == true)
      this.router.navigateByUrl('/' + this.merchantCode + '/paymentsuccess/' + this.room);      
  }

  gotCity(res: any) {
    if(res && res.PostOffice && res.PostOffice.length > 0) {
      this.errorMsg = '';
      let p: any = res.PostOffice[0];
      if(p.Taluk && p.Taluk.toUpperCase() != 'NA')
        this.cart.city = p.Taluk;
      else
        this.cart.city = p.District;

      this.cart.state = p.State;
      this.pin = this.cart.pin;
      this.city = this.cart.city;
      this.state = this.cart.state;
    }
  }

  getCity() {
    if(this.prevPIN != this.cart.pin) {
      this.cart.city = '';
      this.cart.state = '';
      this.prevPIN = this.cart.pin;
      if(this.cart.pin && this.cart.pin.length == 6) {
        if(this.pin == this.cart.pin) {
          this.errorMsg = '';
          this.cart.city = this.city;
          this.cart.state = this.state;
        }
        else {
          this.storeService.getDetailsForPIN(this.cart.pin)
            .then(res => this.gotCity(res));
        }
      }
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
        this.cart = new Cart('', '', '', '', null, this.merchantCode, '', '', '', '');
        this.storeService.assignMerchant(this.merchantCode);
        this.storeService.fetchStoreDetails(this.merchantCode)
        .then(res2 => this.fillStoreSettings(res2))  
      }
      else
        this.router.navigateByUrl('/');   
    }
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

  isUPIButton(): boolean {
    if(this.cart && this.cart.name && this.cart.name.trim().length > 0 && this.cart.email && this.cart.email.trim().length > 2
      && this.cart.phone && this.cart.phone.trim().length > 9 && this.cart.address && this.cart.address.trim().length > 0 
      && this.utilsService.isAnyMobile() && this.cart.paymentMode == 'UPI')
      return true;

    return false;
  }

  qRLinkShown(res: any, txnNo: string) {
    if (res) {
      this.upiURL = res;
      this.room = txnNo;
      this.socketService.joinTransactionRoom(txnNo);
    }
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

  onSSubmit() {
    if(this.isPaymentlink) {
      this.plInfo.name = this.cart.name;
      this.plInfo.email = this.cart.email;
      this.plInfo.address = this.cart.address;
      this.plInfo.phone = this.cart.phone;
      this.paymentlinkService.setPaymentlinkDetails(this.plInfo);
      this.router.navigateByUrl('/paymentmode');  
    }
    else {
      this.errorMsg = '';
      if(this.cart.city) {
        this.cartService.setBuyerInfo(this.cart.name, this.cart.email, this.cart.address, this.cart.phone, this.merchantCode, this.cart.pin,
          this.cart.city, this.cart.state);
        this.router.navigateByUrl('/' + this.merchantCode + '/paymentmode');  
      }
      else
        this.errorMsg = 'Please enter a valid PIN Code';
    }
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
            this.paidAmount = Math.round(this.paidAmount * 102.36) / 100;

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

  onSubmit() {
    this.processing = true;
    this.cartService.setBuyerInfo(this.cart.name, this.cart.email, this.cart.address, this.cart.phone, this.merchantCode, this.cart.pin,
      this.cart.city, this.cart.state);
    this.cartService.setPaymentMode(this.cart.paymentMode, this.merchantCode);
    this.pay();  
  }

  closeModal() {
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }
}
