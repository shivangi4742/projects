import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { SDK } from './../models/sdk.model';
import { User } from './../models/user.model';
import { PayRequest } from './../models/payrequest.model';

import { UtilsService } from './utils.service';

@Injectable()
export class SDKService {
    private _sdk: SDK;
    private _lastBill: PayRequest;
    private _urls: any = {
        createBillURL: 'sdk/createBill',
        createBillStringURL: 'sdk/createBillString',
        getTransactionStatusURL: 'sdk/getTransactionStatus',
        startPaymentProcessURL: 'sdk/startPaymentProcess',
        savePaymentLinkDetailsURL: 'sdk/savePaymentLinkDetails',
        getPaymentLinkDetailsURL: 'sdk/getPaymentLinkDetails'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    private fillSDK(res: any): SDK|null {
        if(res && res.merchantUser) {
            let vpa: string = res.merchantUser.merchantCode + '@yesbank';
            if(res.merchantUser.defaultAcc && res.merchantUser.defaultAcc.virtualAddress)
                vpa = res.merchantUser.defaultAcc.virtualAddress;

            this._sdk = new SDK(res.askmob, res.askadd, res.mndmob, res.mndpan, res.panaccepted, res.mndname, res.askname, res.askemail, res.mndemail, 
                res.mndaddress, false, false, false, res.askresidence, false, false, res.prodMultiselect, false, 2, res.invoiceAmount,
                0, 0, res.minpanamnt, 2, res.totalbudget, res.id, res.surl, res.furl, '', '', res.customerName, res.merchantUser.mccCode, res.fileUrl, '', 
                '', res.merchantUser.id, res.expiryDate, vpa, res.description, res.merchantUser.merchantCode, res.merchantUser.businessName, '', null, 
                null, null, null, null);
        }

        return this._sdk;
    }

    startPaymentProcess(paylinkid: string, name: string, address: string, email: string, mobileNo: string, pan: string, resident: boolean,
        payamount: number, phone: string, merchantcode: string, merchantname: string, merchantVPA: string, paytype: number, tr: string, 
        til: string): Promise<any> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.startPaymentProcessURL,
                JSON.stringify({
                "paylinkid": paylinkid,
                "name": name,
                "address": address,
                "email": email,
                "mobileNo": mobileNo,
                "payamount": payamount,
                "phone": phone,
                "pan": pan,
                "resident": resident,
                "merchantcode": merchantcode,
                "merchantname": merchantname,
                "merchantVPA": merchantVPA,
                "paytype": paytype,
                "tr": tr,
                "til": til
                }), 
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());
    }

    getTransactionStatus(merchantCode: string, txnId: string): Promise<any> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.getTransactionStatusURL,
                JSON.stringify({
                    "merchantCode": merchantCode,
                    "txnId": txnId
                }),
                { headers: this.utilsService.getHeaders() })
                .toPromise()
                .then(res => res.json())
                .catch(res => null);
    }

    createBillString(amount: number, til: string, tr: string, usr: User): Promise<string> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.createBillStringURL,
                JSON.stringify({ 
                    "merchantCode": usr.merchantCode,
                    "tr": tr,
                    "til": til,
                    "amount": amount
                }), 
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.fillBillString(res.json(), amount, til))
            .catch(res => '');
    }

    private fillBillString(res: any, amount: number, vpa: string): string {
        if(res && res.url)
            return res.url;

        return '';
    }

    private fillBill(res: any, amount: number, vpa: string): boolean {
        if(res && res.src) {
            this._lastBill = new PayRequest(amount, '', vpa, res.src, this.utilsService.getDateTimeString(new Date));
            return true;
        }
        else
            return false;
    }

    createBill(amount: number, vpa: string, til: string, tr: string, usr: User): Promise<boolean> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.createBillURL,
                JSON.stringify({ 
                    "merchantCode": usr.merchantCode,
                    "tr": tr,
                    "til": til,
                    "amount": amount
                }), 
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.fillBill(res.json(), amount, vpa))
            .catch(res => false);
    }

    getLastBill(): PayRequest {
        return this._lastBill;
    }

    setSDKAmount(amount: number) {
        if(this._sdk && amount > 0)
            this._sdk.amount = amount;
    }

    getPaymentLinkDetails(campaignId: string): Promise<SDK> {
        if(this._sdk && this._sdk.id)
            return Promise.resolve(this._sdk);
        else
            return this.http
                .post(this.utilsService.getBaseURL() + this._urls.getPaymentLinkDetailsURL,
                JSON.stringify({
                    "campaignId": campaignId
                }),
                { headers: this.utilsService.getHeaders() })
                .toPromise()
                .then(res => this.fillSDK(res.json()))
                .catch(res => this.utilsService.returnGenericError());
    }

    savePaymentLinkDetails(sdk: SDK): Promise<any> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.savePaymentLinkDetailsURL,
            JSON.stringify({
                "sdk": sdk
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => res.json())
            .catch(res => this.utilsService.returnGenericError());
    } 
}
