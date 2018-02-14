import { Injectable } from '@angular/core';

import { Transaction, UtilsService, Payment } from 'benowservices';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
 private _merchantCode: string;
 private _socket: SocketIOClient.Socket;
 private _initialized: boolean = false;
 private _audioFile: string = '../../assets/shared/audios/paymentreceived.wav';
 private _newPayments: Array<Payment> = new Array<Payment>();

 constructor(private utilsService: UtilsService) {
   this._socket = io();
   let me: any = this;
   this._socket.on('paymentreceived', function(paymentData: any) {
     me.showNewPayments(paymentData);
   });
 }

 getNewPayments(): Array<Payment> {
    return this._newPayments;
  }

  showNewPayments(paymentData: any) {
   let me: any = this;
 this._newPayments.push(new Payment(false, paymentData.amount, null, null, paymentData.id, paymentData.tr, paymentData.mode, paymentData.vpa,
     paymentData.till, null, paymentData.dt, null, null, false, null, null, null, null, null));
   if(this._newPayments.length <= 1) {
     setTimeout(function() { me.fadeInNewPayments(); }, 500);
     setTimeout(function() { me.removePayment(paymentData.id); }, 3500);
   }
   else {
     this.playAudio();
     setTimeout(function() { me.removePayment(paymentData.id); }, 3000);
   }
 }

 removePayment(id: string) {
   if(this._newPayments && this._newPayments.length > 0) {
     let indx: number = this._newPayments.findIndex(p => p.id == id);
     if(indx >= 0)
       this._newPayments.splice(indx, 1);

     if(!(this._newPayments && this._newPayments.length > 0))
       this.fadeOutNewPayments();
   }
   else
     this.fadeOutNewPayments();
 }

 fadeOutNewPayments() {
   let el: any = document.getElementById('dummyIncomingMsgBN');
   if(el) {
     el.style.opacity = 1;
     (function fade() {
       if ((el.style.opacity -= .03) < 0) {
         el.style.display = "none";
       } else {
         requestAnimationFrame(fade);
       }
     })();
   }
 }
 fadeInNewPayments() {
   let me = this;
   let el: any = document.getElementById('dummyIncomingMsgBN');
   if(el) {
     el.style.opacity = 0;
     el.style.display = 'block';
     (function fade() {
       var val = parseFloat(el.style.opacity);
       if (!((val += .03) > 1)) {
         el.style.opacity = val;
         requestAnimationFrame(fade);
       }
     })();
   }

   this.playAudio();
 }

 playAudio() {
   let ado: any = new Audio(this._audioFile);
   if(ado) {
     ado.muted = false;
     ado.play();
   }
 }

 startAudio() {
   if(!this._initialized && this.utilsService.isAnyMobile()) {
     let ado: any = new Audio(this._audioFile);
     if(ado) {
       ado.muted = true;
       ado.play();
       this._initialized = true;
     }
   }
 }

 joinMerchantRoom(merchantCode: string) {
   this._merchantCode = merchantCode;
   this._socket.emit('merchantroom', { "room": merchantCode });
 }
}
