import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

var CryptoJS = require('crypto-js');

@Injectable()
export class UtilsService {
  private _uname: string;
  private _token: string;
  private _headers: any;

  private _fixedKey: string = 'NMRCbn';
  private _baseURL: string = 'http://localhost:9090/';

  setUName(un: string) {
    this._uname = un;
  }

  setToken(tkn: string) {
    this._token = tkn;
  }

  setHeaders(hdrs: any) {
    this._headers = hdrs;
  }

  getHeaders(): Headers {
    this._headers['content-type'] = 'application/json';
    if(!this._headers['X-EMAIL'] && this._headers['X-AUTHORIZATION'] && this._uname)
      this._headers['X-EMAIL'] = this._uname;

    return new Headers(this._headers);
  }

  getBaseURL(): string {
    return this._baseURL;
  }

  getDocTitle(lang: number, title: string) {
    if(title == 'Benow - Get UPI/BHIM Enabled Now') {
      switch(lang) {
        case 2:
          return 'बीनाव - यूपीआई/भीम अब सक्षम करें';
        case 3:
          return 'बीनाव - आता यूपीआई/भिम सक्षम करा';
        default:
          return 'Benow - Get UPI/BHIM Enabled Now'; 
      }     
    }
    else if(title == 'benow - admin console') {
      switch(lang) {
        case 2:
          return 'बीनाव - प्रशासन कन्सोल';
        case 3:
          return 'बीनाव - प्रशासन कन्सोल';
        default:
          return 'Benow - Admin Console'; 
      }           
    }
    else if(title == 'benow - ngo console') {
      switch(lang) {
        case 2:
          return 'बीनाव - एनजीओ कन्सोल';
        case 3:
          return 'बीनाव - एनजीओ कन्सोल';
        default:
          return 'Benow - NGO Console'; 
      }                 
    }
    else {
      switch(lang) {
        case 2:
          return 'बीनाव - व्यापारी कन्सोल';
        case 3:
          return 'बीनाव - व्यापारी कन्सोल';
        default:
          return 'Benow - Merchant Console';      
      }
    }
  }

  getLanguageCode(langId: number): string {
    switch(langId) {
      case 0:
        return 'en';
      case 1:
        return 'en';
      case 2:
        return 'hn';
      case 3:
        return 'mr';
      default:
        return 'en';
    }
  }

  encryptPayload(obj: any, ut: boolean): string {
    return CryptoJS.AES.encrypt(JSON.stringify(obj), this.getKey(ut)).toString();
  }

  decryptPayload(obj: any, ut: boolean): any {
    if(obj && obj.data)
      return JSON.parse(CryptoJS.AES.decrypt(obj.data, this.getKey(ut)).toString(CryptoJS.enc.Utf8));

    return null;
  }

  returnGenericError(): any {
    return { "success": false, "errMsg": "Something went wrong. Please try again."};
  }

  private getKey(ut: boolean): string {
    if(ut && this._token)
      return this._token;
    else 
      return this._fixedKey;
  }
}