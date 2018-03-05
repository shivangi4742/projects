import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { UtilsService } from './utils.service';

@Injectable()
export class StoreService {
    private _urls: any = {
        fetchStoreDetailsURL: 'store/fetchStoreDetails'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

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