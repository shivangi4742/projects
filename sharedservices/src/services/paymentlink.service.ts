import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { UtilsService } from './utils.service';

@Injectable()
export class PaymentlinkService {
    private _paymentLink: any;
    private _urls: any = {
        startPaymentProcessURL: 'cart/startPaymentProcess'
    }

    constructor(private utilsService: UtilsService, private http: Http) { }

    public getPaymentlinkDetails(): any {
        return this._paymentLink;
    }

    public setPaymentlinkDetails(pl: any) {
        this._paymentLink = pl;
    }

    public startPayUPaymentProcess(merchantName: string, amount: number): Promise<any> {
        let pt: string = '';
        if (this._paymentLink.paymentMode == 'DC')
            pt = 'DEBIT_CARD';
        else if (this._paymentLink.paymentMode == 'CC')
            pt = 'CREDIT_CARD';
        else if (this._paymentLink.paymentMode == 'NB')
            pt = 'NET_BANKING';

        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.startPaymentProcessURL,
                JSON.stringify({
                    "name": this._paymentLink.name,
                    "address": this._paymentLink.address,
                    "email": this._paymentLink.email,
                    "payamount": amount,
                    "phone": this._paymentLink.phone,
                    "merchantcode": this._paymentLink.merchantCode,
                    "merchantname": merchantName,
                    "paytype": pt,
                    "isPaymentlink": true,
                    "purpose": this._paymentLink.purpose
                }),
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());
    }

    public startUPIPaymentProcess(merchantVPA: string, merchantName: string, amount: number): Promise<any> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.startPaymentProcessURL,
                JSON.stringify({
                    "name": this._paymentLink.name,
                    "address": this._paymentLink.address,
                    "email": this._paymentLink.email,
                    "payamount": amount,
                    "phone": this._paymentLink.phone,
                    "merchantcode": this._paymentLink.merchantCode,
                    "merchantname": merchantName,
                    "merchantvpa": merchantVPA,
                    "paytype": 'UPI_OTHER_APP',
                    "isPaymentlink": true,
                    "purpose": this._paymentLink.purpose
                }),
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());
    }

}