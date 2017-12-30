import { Injectable } from '@angular/core';
import { Headers, Response, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Mgl } from '../models/mgl';
import { User, UtilsService } from 'benowservices';

@Injectable()
export class MglService {
  private _user: User;  
  private _mgl: Mgl;
  private _mobnumber:string;
  private _headers: any;
  private _urls: any = { 
  'mglDetailURL': 'mglpay/mgldetails', 
  'mglfailureURL': 'mglpay/mglfailure', 
  'mglsuccessURL': 'mglpay/mglsuccess',
  
  'mgldetailsSaveURL' : 'mglpay/mgldetailssave',
  'mglpreactionURL':'mglpay/checkPaymentPreActionData'}

  constructor(private http: Http, private utilsService: UtilsService) { }

  getmglDetails(csmno: string, mobno:string): Promise<any> {
    this._mobnumber = mobno;
    return this.http.post(
      this.utilsService.getBaseURL() + this._urls.mglDetailURL,
      {
        consumerno: csmno
      }
    )
      .toPromise()
      .then(res => this.gettmglDetails(res))
      .catch(res => this.utilsService.returnGenericError());
  }

  getSuccessURL(): string {
    return this.utilsService.getBaseURL() + this._urls.mglsuccessURL;
  }

  getFailedURL(): string {
    return this.utilsService.getBaseURL() + this._urls.mglfailureURL;
  }

  gettmglDetails(res: any): Mgl {
   
    let response = JSON.parse(res._body);
    let d: any = response.data.RECORD;
    this._mgl = new Mgl(d.STATUS[0], d.BP[0], d.CA[0], d.BILLNO[0], d.NETPAY[0], d.NAME[0], d.BILLDT[0], d.DUEDT[0], d.DESPDT[0], d.BILLMON[0], d.GROUP[0],d, this._mobnumber);
   
    return this._mgl;
  }

  getmgldata(): Mgl {
    return this._mgl;
  }
 
  mgldetailssave( transactionRef:string, actionData:string, tag2: string, tag3:string): Promise<any> {
   
    return this.http.post(
      this.utilsService.getBaseURL() + this._urls.mgldetailsSaveURL,
      JSON.stringify({
          "transactionRef":transactionRef,
          "actionData": actionData,
          "tag1":"MahaNagar Gas",
          "tag2":tag2,
          "tag3":tag3,
          "val1":"",
          "val2":"",
          "val3":""
          
        }), 
        { headers: this.getTempHeaders() })
      .toPromise()
      .then(res => this.gettmglSaveDetails(res))
      .catch(res => this.utilsService.returnGenericError());
  }

  gettmglSaveDetails(res:any){
     //console.log(res);
  }
   private getTempHeaders(): any {
    let headers: any = {
      'content-type': 'application/json',
      
    };

    return new Headers(headers);
  }
  checkPaymentPreActionData( tag1: string, tag3:string): Promise<any> {
   
    return this.http.post(
      this.utilsService.getBaseURL() + this._urls.mglpreactionURL,
      JSON.stringify({ 
        
         "tag1":"MahaNagar Gas",
	       "tag3":tag3
          
        }), 
        { headers: this.getTempHeaders() })
      .toPromise()
      .then(res => res)
      .catch(res => this.utilsService.returnGenericError());
  }

}
