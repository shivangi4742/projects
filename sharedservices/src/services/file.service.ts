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
        downloadURL: 'file/download'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    upload(file: File, sourceId: string, sourceType: string, cb: any, cbParams: any) {
        const formData: any = new FormData();
        formData.append('data', { "sourceId": sourceId, "sourceType": sourceType });
        formData.append('headers', this.utilsService.getFileHeaders());
        formData.append('file', file, file['name']); 
        this.http.post(this.utilsService.getBaseURL() + this._urls.uploadURL, formData)
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
}