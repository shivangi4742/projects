import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { SDK } from './../models/sdk.model';

import { UtilsService } from './utils.service';

@Injectable()
export class SDKService {
    private _urls: any = {
        savePaymentLinkDetailsURL: 'sdk/savePaymentLinkDetails',
        getPaymentLinkDetailsURL: 'sdk/getPaymentLinkDetails'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    private fillSDK(res: any): SDK|null {
        if(res && res.merchantUser) {
            let vpa: string = res.merchantUser.merchantCode + '@yesbank';
            if(res.merchantUser.defaultAcc && res.merchantUser.defaultAcc.virtualAddress)
                vpa = res.merchantUser.defaultAcc.virtualAddress;

            return new SDK(res.askmob, res.askadd, res.mndmob, res.mndpan, res.panaccepted, res.mndname, res.askname, res.askemail, res.mndemail, 
                res.mndaddress, false, false, false, res.askresidence, false, false, res.prodMultiselect, false, 2, res.invoiceAmount,
                0, 0, res.minpanamnt, 2, res.totalbudget, res.id, res.surl, res.furl, '', '', res.customerName, res.merchantUser.mccCode, res.fileUrl, '', 
                '', res.merchantUser.id, res.expiryDate, vpa, res.description, res.merchantUser.merchantCode, res.merchantUser.businessName, '', null, 
                null, null, null, null);
        }
        else
            return null;
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
