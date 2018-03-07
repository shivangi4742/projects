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
    private _subject = new Subject<any>();
    private _urls: any = {
        fetchStoreDetailsURL: 'store/fetchStoreDetails'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

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
        return this.http.post(
            this.utilsService.getBaseURL() + this._urls.fetchStoreDetailsURL,
            JSON.stringify({
                "merchantCode": merchantCode
            }),
            { headers: this.utilsService.getHeaders() }
        )
        .toPromise()
        .then(res => res.json())
        .catch(res => this.utilsService.returnGenericError());
    }
}