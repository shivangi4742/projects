import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

var CryptoJS = require('crypto-js');

@Injectable()
export class UtilsService {
  private _uname: string;
  private _token: string;
  private _headers: any;

  private _isNGO: boolean = false;
  private _fixedKey: string = 'NMRCbn';
  private _baseURL: string = 'http://localhost:9090/';
  private _loginPageURL: string = 'http://localhost:9090/login/login/1';
  private _logoutPageURL: string = 'http://localhost:9090/login/logout/6';
  private _ngoDashboardPageURL: string = 'http://localhost:9090/ngo/dashboard';
  private _changePasswordPageURL: string = 'http://localhost:9090/login/verify/2';
  private _adminDashboardPageURL: string = 'http://localhost:9090/admin/dashboard';
  private _managerDashboardPageURL: string = 'http://localhost:9090/manager/dashboard';
  private _merchantDashboardPageURL: string = 'http://localhost:9090/merchant/dashboard';

  public getManagerDashboardPageURL(): string {
    return this._managerDashboardPageURL;    
  }

  public getNGODashboardPageURL(): string {
    return this._ngoDashboardPageURL;
  }

  public getMerchantDashboardPageURL(): string {
    return this._merchantDashboardPageURL;
  }

  public getAdminDashboardPageURL(): string {
    return this._adminDashboardPageURL;
  }

  public getChangePasswordPageURL(): string {
    return this._changePasswordPageURL;    
  }

  public getLoginPageURL(): string {
    return this._loginPageURL;
  }

  public getLogoutPageURL(): string {
    return this._logoutPageURL;
  }

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

  getDateOnlyString(dt: Date): string {
    return this.getDate(dt.getDate()) + '/' + this.getMonth(dt.getMonth()) + '/' + dt.getFullYear();
  }

  isNGO(mccCode: string|null): boolean {
    if(mccCode === '8398')
      this._isNGO = true;

    return this._isNGO;
  }

  getDateTimeString(dt: Date): string {
    return this.getDate(dt.getDate()) + '/' + this.getMonth(dt.getMonth()) + '/' + dt.getFullYear() + ' '  + this.getHoursOrMinutes(dt.getHours()) 
      + ':' + this.getHoursOrMinutes(dt.getMinutes());
  }

  clearStorages() {
    localStorage.removeItem('bnMRC');
    sessionStorage.removeItem('bnMRC');
  }

  setLanguageInStorage(lang: number) {
    let sbnMRCObj = sessionStorage.getItem('bnMRC');
    if(sbnMRCObj) {
      let sbnMRC = JSON.parse(sbnMRCObj);
      if(sbnMRC && sbnMRC.token && sbnMRC.username) {
        sbnMRC.language = lang;
        sessionStorage.setItem('bnMRC', JSON.stringify(sbnMRC));
      }
    }

    let lbnMRCObj = localStorage.getItem('bnMRC');
    if(lbnMRCObj) {   
      let lbnMRC = JSON.parse(lbnMRCObj);   
      if(lbnMRC && lbnMRC.token && lbnMRC.username) {
        lbnMRC.language = lang;
        localStorage.setItem('bnMRC', JSON.stringify(lbnMRC));
      }
    }
  }

  private getHoursOrMinutes(h: number) {
    if(h < 10)
      return '0' + h.toString();

    return h.toString();
  }

  private getDate(d: number) {
    if(d < 10)
      return '0' + d.toString();

    return d.toString();
  }

  private getMonth(m: number) {
    let mon: number = m + 1;
    if(mon < 10)
      return '0' + mon.toString();

    return mon.toString();
  }
  
  private getKey(ut: boolean): string {
    if(ut && this._token)
      return this._token;
    else 
      return this._fixedKey;
  }
}