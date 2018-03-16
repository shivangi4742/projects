import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { UtilsService } from './utils.service';

@Injectable()
export class StoreService {
    private _code: string;
    private _settings: any;
    private _subject = new Subject<any>();
    private _urls: any = {
        fetchStoreDetailsURL: 'store/fetchStoreDetails'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    private setSettings(res: any): any {
        this._settings = res;
        return this._settings;
    }

    public merchantAssigned(): Observable<any> {
        return this._subject.asObservable();        
    }

    public assignMerchant(code: string) {
        if(!this._code || this._code != code) {
            this._code = code;
            this._subject.next(code);
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

}