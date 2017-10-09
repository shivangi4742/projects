import { Injectable } from '@angular/core';
import { Headers, Response,Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Mgl } from '../models/mgl';

import { UtilsService } from '../../../../sharedservices/src/services/utils.service';



@Injectable()
export class MglService {

  private _mgl: Mgl;

  private _urls: any = { 'mglDetailURL':  'merchant/mgldetails' }

  constructor(private http: Http, private utilsService: UtilsService) { }

  getmglDetails(csmno:string): Promise<any> {
    console.log(csmno,'ghh');
        return this.http.post (
            this.utilsService.getBaseURL() + this._urls.mglDetailURL,
            { 
              consumerno:csmno
            }
        )
       .toPromise()
       .then(res => this.gettmglDetails(res))
       .catch(res => this.utilsService.returnGenericError());
    }

  gettmglDetails(res:any): Mgl{
    let response=JSON.parse(res._body);
    let d:any= response.data.RECORD;
    this._mgl = new Mgl(d.STATUS[0],d.BP[0], d.CA[0],d.BILLNO[0],d.NETPAY[0],d.NAME[0],d.BILLDT[0], d.DUEDT[0],  d.DESPDT[0], d.BILLMON[0],d.GROUP[0] );
    
    return this._mgl;
  }

  getmgldata():Mgl {
    return this._mgl;
  }

}
