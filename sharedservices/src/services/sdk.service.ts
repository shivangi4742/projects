import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { PG } from './../models/pg.model';
import { SDK } from './../models/sdk.model';
import { User } from './../models/user.model';
import { Product } from './../models/product.model';
import { PayRequest } from './../models/payrequest.model';

import { UtilsService } from './utils.service';

@Injectable()
export class SDKService {
    private _pg: PG;
    private _sdk: SDK;
    private _lastBill: PayRequest;
    private _paySuccess: any;
    private _payFailure: any;
    private _urls: any = {
        getHashURL: 'sdk/getHash',
        createBillURL: 'sdk/createBill',
        createBillStringURL: 'sdk/createBillString',
        getTransactionStatusURL: 'sdk/getTransactionStatus',
        startPaymentProcessURL: 'sdk/startPaymentProcess',
        getPaymentLinkDetailsURL: 'sdk/getPaymentLinkDetails'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    public setPG(pg: PG) {
        this._pg = pg;
    }

    public getPG(): PG {
        return this._pg;
    }

    public setProductsInSDK(products: Array<Product>) {
        if(this._sdk)
            this._sdk.products = products;
    }

    private fillSDK(res: any): SDK|null {
        if(res && res.merchantUser) {
            let vpa: string = res.merchantUser.merchantCode + '@yesbank';
            if(res.merchantUser.defaultAcc && res.merchantUser.defaultAcc.virtualAddress)
                vpa = res.merchantUser.defaultAcc.virtualAddress;

            let modes: Array<string> = new Array<string>();
            modes.push('UPI');
            if(res.merchantUser.acceptedPaymentMethods && res.merchantUser.acceptedPaymentMethods.length > 0) {
                res.merchantUser.acceptedPaymentMethods.forEach(function(m: any) {
                    if(m && m.paymentMethod) {
                        if ((m.paymentMethod == 'CREDIT_CARD' || m.paymentMethod == 'CC') && modes.indexOf('CC') < 0)
                            modes.push('CC');
                        else if ((m.paymentMethod == 'DEBIT_CARD' || m.paymentMethod == 'DC') && modes.indexOf('DC') < 0)
                            modes.push('DC');
                        else if ((m.paymentMethod == 'NET_BANKING' || m.paymentMethod == 'NB') && modes.indexOf('NB') < 0)
                            modes.push('NB');
                        else if ((m.paymentMethod == 'MEAL_COUPON' || m.paymentMethod == 'SODEXO') && modes.indexOf('SODEXO') < 0)
                            modes.push('SODEXO');                        
                    }
                });
            }

            let mtype: number = 2;
            if(this.utilsService.isHB(res.merchantUser.merchantCode))
                mtype = 3;

            this._sdk = new SDK(res.askmob, res.askadd, res.mndmob, res.mndpan, res.panaccepted, res.mndname, res.askname, res.askemail, res.mndemail, 
                res.mndaddress, false, false, false, res.askresidence, false, false, res.prodMultiselect, false, mtype, res.invoiceAmount, 0, 0, 
                res.minpanamnt, 2, res.totalbudget, res.id, '', res.surl ? res.surl : '', res.furl ? res.furl : '', '', '', res.customerName, 
                res.merchantUser.mccCode, res.fileUrl, '', '', res.merchantUser.id, res.expiryDate, vpa, res.description ? res.description : '', 
                res.merchantUser.merchantCode, res.merchantUser.businessName, '', null, null, null, null, null, null, null, null, null, null, modes, 
                null);
        }

        return this._sdk;
    }

    startPaymentProcess(paylinkid: string, name: string, address: string, email: string, mobileNo: string, pan: string, resident: boolean,
        payamount: number, phone: string, merchantcode: string, merchantname: string, merchantVPA: string, paytype: number, tr: string, 
        til: string, products: Array<Product>): Promise<any> {
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
                "til": til,
                "products": products
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
			this._lastBill = new PayRequest(amount, '', vpa, this.utilsService.getBaseURL() + res.src, this.utilsService.getDateTimeString(new Date));
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

    setPayFailure(pf: any) {
        this._payFailure = pf;
    }

    getPayFailure(): any {
        return this._payFailure;
    }

    setPaySuccess(ps: any) {
        this._paySuccess = ps;
    }

    getPaySuccess(): any {
        return this._paySuccess;
    }
}
