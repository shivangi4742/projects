import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { User } from "../models/user.model";

import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { UtilsService } from './utils.service';

@Injectable()
export class StoreService {
    private _code: string;
    private _user:User;
    private _settings: any;
    private _urlMerchant: any;
    private _subject = new Subject<any>();
    private _urls: any = {
        fetchStoreDetailsURL: 'store/fetchStoreDetails',
        getMerchantDetailsFromURLURL: 'store/getMerchantDetailsFromURL',
        fetchStoreDetailedURL:'user/fetchMerchantForEditDetails'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    private setSettings(res: any): any {
        this._settings = res;
        return this._settings;
    }

    private setURLMerchant(res: any): any {
        this._urlMerchant = res;
        return this._urlMerchant;
    }

    public merchantAssigned(): Observable<any> {
        return this._subject.asObservable();        
    }

    public assignMerchant(code: string) {
        if(code) {
            this._code = code;
            this._subject.next(code);
        }
    }

    public getMerchantDetailsFromURL(): Promise<any> {
        if(this._urlMerchant)
            return Promise.resolve(this._urlMerchant);
        else {
            let u: string = window.location.href;
            if(this.utilsService.getIsDevEnv())
                u = this.utilsService.getTestDomainURL();
                
            return this.http.post(
                this.utilsService.getBaseURL() + this._urls.getMerchantDetailsFromURLURL,
                JSON.stringify({
                    "url": u
                }),
                { headers: this.utilsService.getHeaders() }
            )        
            .toPromise()
            .then(res => this.setURLMerchant(res.json()))
            .catch(res => this.utilsService.returnGenericError());
        }
    }

    public fetchStoreDetails(merchantCode: string): Promise<any> {
        if(this._code && merchantCode == this._code) {
            if(this._settings)
                return Promise.resolve(this._settings);
        }
        else
            this.assignMerchant(merchantCode);

        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.fetchStoreDetailsURL,
            JSON.stringify({
                "merchantCode": merchantCode
            }),
            { headers: this.utilsService.getHeaders() }
        )
        .toPromise()
        .then(res => this.setSettings(res.json()))
        .catch(res => this.utilsService.returnGenericError());
    }
      public fetchStoreDetais(merchantCode: string): Promise<any> {
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.fetchStoreDetailsURL,
            JSON.stringify({
                "merchantCode": merchantCode
            }),
            { headers: this.utilsService.getHeaders() }
        )
        .toPromise()
        .then(res => this.setSettings(res.json()))
        .catch(res => this.utilsService.returnGenericError());
    }
    public fetchStoreimagDetais(userId: string, id:string ): Promise<any> {
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.fetchStoreDetailedURL,
            JSON.stringify({
                "userId": userId,
                "sourceId":id,
                "sourceType":"MERCHANT_REG"
            }),
            { headers: this.utilsService.getHeaders() }
        )
        .toPromise()
        .then(res => res.json())
        .catch(res => this.utilsService.returnGenericError());
    }
 
  
}