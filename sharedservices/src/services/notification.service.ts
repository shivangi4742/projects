import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { Attachment } from './../models/attachment.model';
import { Notification } from './../models/notification.model';

import { UtilsService } from './utils.service';

@Injectable()
export class NotificationService {
    private _curKey: string;
    private _notifs: Notification[];
    private _urls: any = {
        getNotificationsURL: 'merchant/getNotifications'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    fillNotifications(key: string, res: any): Notification[] {
        if(res && res.list && res.list.length > 0) {
            this._curKey = key;
            if(!this._notifs)
                this._notifs = new Array<Notification>();
            
            let me = this;
            res.list.forEach(function(r: any) {
                let cDate: Date = new Date(r.creationDate);
                let hasAttachments: boolean = false;
                let attchs: Attachment[] = new Array<Attachment>();;
                if(r.attchments && r.attchments.length > 0) {
                    hasAttachments = true;
                    r.attchments.forEach(function(a: any) {
                        attchs.push(new Attachment(a.id, a.attachUrl, a.attachFile));
                    });
                }

                me._notifs.push(new Notification(false, !r.msgReadStatus, r.msgImpFlag, hasAttachments, r.id, 'notfattr' + r.id, r.msgType, r.merchantCode, 
                    r.msgFrom, r.msgSubject, r.msgBody, me.utilsService.getDateOnlyString(cDate), attchs.length > 0 ? attchs : null));
            });
        }
        
        return this._notifs
    }

    getNotifications(mCode: string|null, page: number, onlyUnread: boolean, onlyImp: boolean): Promise<Notification[]|null> {
        let key: string = mCode ? mCode : '' + page + onlyUnread + onlyImp;
        if(this._notifs && this._curKey && this._curKey == key)
            return Promise.resolve(this._notifs);

        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.getNotificationsURL,
                JSON.stringify({
                    "data": this.utilsService.encryptPayload({
                        "merchantCode": mCode,
                        "pageNumber": page
                    }, true)
                }), 
                { headers: this.utilsService.getHeaders() 
            })
            .toPromise()
            .then(res => this.fillNotifications(key, this.utilsService.decryptPayload(res.json(), true)))
            .catch(res => null);        
    }
}