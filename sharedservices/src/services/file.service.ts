import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';

@Injectable()
export class FileService {
    private _urls: any = {
        uploadURL: 'file/upload',
        downloadURL: 'file/download',
        sendEmailURL: 'file/sendEmailNotify'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    upload(file: File, sourceId: string, sourceType: string, cb: any, cbParams: any) {
        const formData: any = new FormData();
        formData.append('data', JSON.stringify({ "sourceId": sourceId, "sourceType": sourceType }));
        formData.append('headers', JSON.stringify(this.utilsService.getFileHeaders()));
        formData.append('file', file, file['name']); 
        this.http.post(this.utilsService.getBaseURL() + this._urls.uploadURL, formData)
            .map(files => files.json())
            .subscribe((data) => cb(data, cbParams),
                (err) => cb(err, cbParams));
    }

    sendEmailNotify(file: File, to: string, subject: string, text: string, cb: any, cbParams: any) {
        const formData: any = new FormData();
        formData.append('data', JSON.stringify({ "to": to, "subject": subject, "text": text }));
        formData.append('headers', JSON.stringify(this.utilsService.getFileHeaders()));
        formData.append('file', file, file['name']);
        this.http.post(this.utilsService.getBaseURL() + this._urls.sendEmailURL, formData)
            .map(files => files.json())
            .subscribe((data) => cb(data, cbParams),
                (err) => cb(err, cbParams));
    }

    download(file: string) {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.downloadURL,
                JSON.stringify({
                    "fileUrl": file
                }), 
                { headers: this.utilsService.getHeaders() 
            })
            .toPromise()
            .then(res => res.json())
            .catch(res => null);        
    }
    
     upload1(file: File, sourceId: string, sourceType: string, documentName:string, documentCode:string, cb: any, cbParams: any) {
        const formData: any = new FormData();
        formData.append('data', JSON.stringify({"sourceId": sourceId, "sourceType": sourceType, "documentName": documentName , "documentCode": documentCode }));
        formData.append('headers', JSON.stringify(this.utilsService.getFileHeaders()));
        formData.append('file', file, file['name']); 
        this.http.post(this.utilsService.getBaseURL() + this._urls.uploadURL, formData)
            .map(files => files.json())
            .subscribe((data) => cb(data, cbParams),
                (err) => cb(err, cbParams));
    }
}