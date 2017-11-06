import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { UtilsService } from './utils.service';

@Injectable()
export class HelpService {
    private _help: any;
    private _urls: any = {
        getHelpTextsURL: 'help/getHelpTexts'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    fillHelp(res: any): any {
        if(res && res.desc1)
            return JSON.parse(res.desc1);

        return {};
    }

    getHelpTexts(): Promise<any> {
        if(this._help)
            return Promise.resolve(this._help);
        else
            return this.http
                .post(this.utilsService.getBaseURL() + this._urls.getHelpTextsURL,
                null,
                { headers: this.utilsService.getHeaders() })
                .toPromise()
                .then(res => this.fillHelp(res.json()))
                .catch(res => this.utilsService.returnGenericError());            
    }
}