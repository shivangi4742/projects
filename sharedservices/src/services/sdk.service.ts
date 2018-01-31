import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { PG } from './../models/pg.model';
import { SDK } from './../models/sdk.model';
import { User } from './../models/user.model';
import { Product } from './../models/product.model';
import { Fundraiser } from './../models/fundraiser.model';
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
        getFundraiserDetailsURL: 'sdk/getFundraiserDetails',
        getPaymentLinkDetailsURL: 'sdk/getPaymentLinkDetails',
        updateFundraiserCollectionURL: 'sdk/updateFundraiserCollection',
        getLogByIdURL: 'sdk/getLogById'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    public setPG(pg: PG) {
        this._pg = pg;
    }

    public getPG(): PG {
        return this._pg;
    }

    public setProductsInSDK(products: Array<Product>) {
        if (this._sdk)
            this._sdk.products = products;
    }

    private formatDTMT(md: string) {
        if(md && md.length < 2)
            return '0' + md;

        return md;
    }

    private fillSDK(res: any): SDK | null {
        let convFee: boolean = false;
        if (res && res.merchantUser) {
            convFee = res.merchantUser.chargeConvenienceFee;
            let vpa: string = res.merchantUser.merchantCode + '@yesbank';
            if (res.merchantUser.defaultAcc && res.merchantUser.defaultAcc.virtualAddress)
                vpa = res.merchantUser.defaultAcc.virtualAddress;

            let modes: Array<string> = new Array<string>();
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
                        else if ((m.paymentMethod == 'UPI_OTHER_APP' || m.paymentMethod == 'UPI') && modes.indexOf('UPI') < 0)
                            modes.push('UPI');
                        else if ((m.paymentMethod == 'CASH' || m.paymentMethod == 'COD') && modes.indexOf('CASH') < 0)
                            modes.push('CASH');
                    }
                });
            }

            if (modes.length <= 0)
                modes.push('UPI');

            let mtype: number = 1;
            if (this.utilsService.isNGO(res.merchantUser.mccCode))
                mtype = 2;
            else if(this.utilsService.isHB(res.merchantUser.merchantCode, res.merchantUser.businessLob))
                mtype = 3;            

            let ttl: string = res.campaignName;
            if(mtype == 1 || !ttl)
                ttl = res.merchantUser.displayName;

            var expiryDate = '';
            if(res.expiryDate){
                let dt = new Date(res.expiryDate);
                expiryDate = this.formatDTMT(dt.getDate().toString()) + '-' + this.formatDTMT((dt.getMonth() + 1).toString()) + '-' + dt.getFullYear();
            }

            this._sdk = new SDK(res.employeeId, res.askempid, res.mndempid, res.companyName, res.askcompname, res.mndcompname, res.askmob, res.askadd, res.mndmob, res.mndpan, res.panaccepted, res.mndname, res.askname, res.askemail, res.mndemail, 
                res.mndaddress, false, false, false, res.askresidence, false, false, res.prodMultiselect, false, mtype, res.invoiceAmount, 0, 0, 
                res.minpanamnt, mtype, res.totalbudget, res.id, '', res.surl ? res.surl : '', res.furl ? res.furl : '', '', 
                (mtype == 1) ? res.mobileNumber : '', ttl, 
                res.merchantUser.mccCode, res.fileUrl, '', '', res.merchantUser.id, expiryDate, vpa, res.description ? res.description : '',
                res.merchantUser.merchantCode, res.merchantUser.displayName, res.txnrefnumber, res.invoiceNumber, res.till, null, null, null, null, 
                null, null, null, null, null, modes, null, null, convFee);
        }
        else if (res.logFormate) {
            var obj = JSON.parse(res.logText);

            // this._sdk = new SDK(obj.askmob, obj.askadd, obj.mndmob, obj.mndpan, obj.askpan, obj.mndname, obj.askname, obj.askemail, obj.mndemail,
            //     obj.mndaddress, obj.readonlymob, obj.readonlypan, obj.readonlyname, obj.askresidence, obj.readonlyaddr, obj.readonlyemail,
            //     obj.allowMultipleSelect, obj.readonlyresidnce, obj.mtype, obj.amount, obj.language, obj.sourceId, obj.minpanamnt, obj.merchantType,
            //     obj.campaignTarget, obj.id, obj.hash, obj.surl, obj.furl, obj.email, obj.phone, obj.title, obj.mccCode, obj.imageURL, obj.lastName,
            //     obj.firstName, obj.merchantId, obj.expiryDate, obj.merchantVpa, obj.description, obj.merchantCode, obj.businessName, obj.invoiceAmount,
            //     obj.til, obj.vpa, obj.url, obj.udf1, obj.udf2, obj.udf3, obj.udf4, obj.udf5, obj.mode, obj.txnid, obj.supportedModes, obj.products);

            this._sdk = new SDK(JSON.parse(res.employeeId), JSON.parse(res.askempid), JSON.parse(res.mndempid), JSON.parse(res.companyName), JSON.parse(res.askcompname), JSON.parse(res.mndcompname),JSON.parse(obj.askmob), JSON.parse(obj.askadd), JSON.parse(obj.mndmob), JSON.parse(obj.mndpan), JSON.parse(obj.askpan),
                JSON.parse(obj.mndname), JSON.parse(obj.askname), JSON.parse(obj.askemail), JSON.parse(obj.mndemail), JSON.parse(obj.mndaddress), JSON.parse(obj.readonlymob), 
                JSON.parse(obj.readonlypan), JSON.parse(obj.readonlyname), JSON.parse(obj.askresidence), JSON.parse(obj.readonlyaddr), Boolean(obj.readonlyemail),
                Boolean(obj.allowMultipleSelect), Boolean(obj.readonlyresidnce), obj.mtype, obj.amount, obj.language, obj.sourceId, obj.minpanamnt, obj.merchantType,
                obj.campaignTarget, obj.id, obj.hash, obj.surl, obj.furl, obj.email, obj.phone, obj.title, obj.mccCode, obj.imageURL, obj.lastName,
                obj.firstName, obj.merchantId, obj.expiryDate, obj.merchantVpa, obj.description, obj.merchantCode, obj.businessName, obj.txnrefnumber, 
                obj.invoiceAmount, obj.til, obj.vpa, obj.url, obj.udf1, obj.udf2, obj.udf3, obj.udf4, obj.udf5, obj.mode, obj.txnid, 
                obj.supportedModes, obj.products, null, obj.chargeConvenienceFee);
        }

        return this._sdk;
    }

    startPaymentProcess(employeeId:string, companyName:string, paylinkid: string, name: string, address: string, email: string, mobileNo: string, pan: string, resident: boolean,
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
                "products": products,
                "employeeId": employeeId ,
                "companyName": companyName
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

    updateFundraiserCollection(amount: number, fundraiserId: string, campaignId: string): Promise<boolean> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.updateFundraiserCollectionURL,
            JSON.stringify({
                "amount": amount,
                "campaignId": campaignId,
                "fundraiserId": fundraiserId
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.updatedFundraiserCollection(res.json()))
            .catch(res => false);
    }

    updatedFundraiserCollection(res: any): boolean {
        if(res && res.responseFromAPI == true)
            return true;
            
        return false;
    }

    getFundraiserDetails(fundraiserId: string, campaignId: string): Promise<Fundraiser|null> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.getFundraiserDetailsURL,
            JSON.stringify({
                "campaignId": campaignId,
                "fundraiserId": fundraiserId
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.fillFundraiser(res.json()))
            .catch(res => null);
    }

    fillFundraiser(res: any): Fundraiser|null {
        if(res && res.id > 0) {
            return new Fundraiser(res.id, res.totalTarget, res.actualCollection, res.fundraiserId, res.txnRefNumber, res.fundraiserName);
        }

        return null;
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
        if (res && res.url)
            return res.url;

        return '';
    }

    private fillBill(res: any, amount: number, vpa: string): boolean {
        if (res && res.src) {
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

    getLogById(sdkId: string): Promise<any> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.getLogByIdURL,
            JSON.stringify({
                "id": sdkId
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
