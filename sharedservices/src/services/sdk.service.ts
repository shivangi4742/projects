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
