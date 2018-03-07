import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { MaterializeAction } from 'angular2-materialize';

import { Cart, CartService, StoreService, SDKService, User, SocketService, PayRequest } from 'benowservices';

@Component({
  selector: 'paymentmode',
  templateUrl: './paymentmode.component.html',
  styleUrls: ['./paymentmode.component.css']
})
export class PaymentmodeComponent implements OnInit {
  paidAmount: number;
  room: string;
  defaultVPA: string;
  merchantCode: string;
  cart: Cart;
  payRequest: PayRequest;
  subscription: Subscription;  
  settings: any;
  processing: boolean = false;
  modalActions: any = new EventEmitter<string | MaterializeAction>();

  constructor(private cartService: CartService, private router: Router, private storeService: StoreService, 
    private activatedRoute: ActivatedRoute, private sdkService: SDKService, private socketService: SocketService) { 
    let me: any = this;
    this.subscription = this.socketService.receivedPayment().subscribe(message => me.receivedPayment(message));        
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
    if(res && res.items && res.items.length > 0)
      this.cart = res;
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
            this.paidAmount = this.paidAmount * 1.02;

          this.cartService.startUPIPaymentProcess(this.defaultVPA, this.settings.displayName, this.paidAmount)
            .then(res => this.finishUPIPayment(res));
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
