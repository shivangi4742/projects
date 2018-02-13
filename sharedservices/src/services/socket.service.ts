import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import 'rxjs/Rx';
import * as io from 'socket.io-client';

import { UtilsService } from './utils.service';

@Injectable()
export class SocketService {
    private _till: string|null;
    private _merchantCode: string;
    private _socket: SocketIOClient.Socket;
    private _subject2 = new Subject<any>();

    constructor(private utilsService: UtilsService) { 
        this._socket = io();
        let me: any = this;
        this._socket.on('paymentreceived', function(paymentData: any) {
            me._subject2.next({ out: true, data: paymentData });
        });
    }

    public receivedPayment(): Observable<any> {
        return this._subject2.asObservable();
    }

    joinTransactionRoom(txnId: string) {
        if(txnId)
            this._socket.emit('transactionroom', { "room": txnId });
    }

    joinMerchantRoom(merchantCode: string, till: string|null) {
        this._merchantCode = merchantCode;
        this._till = till;
        let room: string = merchantCode;
        if(till)
            room += '|' + till;

        this._socket.emit('merchantroom', { "room": room });
    }
}
