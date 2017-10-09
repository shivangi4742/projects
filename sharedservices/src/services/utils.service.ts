import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import { Status } from '../models/status.model';

@Injectable()
export class UtilsService {
  private _uname: string;
  private _token: string;
  private _headers: any = { };
  private _status: Status;

  private _isNGO: boolean = false;
  private _fixedKey: string = 'NMRCbn';
  private _baseURL: string = 'http://localhost:9090/';

  private _pbaseURL: string = 'http://localhost:9090/';
  private _requestURL:string = 'https://merchant.benow.in/paysdk';
  private _succcessURL:string = 'mglsuccess';
  private _failureURL:string = 'mglfailure'

  private _processPaymentURL: string = 'http://localhost:9090/sdk/processPayment';
  private _loginPageURL: string = 'http://localhost:9090/lgn/login/1';
  private _logoutPageURL: string = 'http://localhost:9090/lgn/logout/6';
  private _ngoDashboardPageURL: string = 'http://localhost:9090/ngocsl/dashboard';
  private _mybizDashboardPageURL: string = 'http://localhost:9090/mybiz/dashboard';
  private _changePasswordPageURL: string = 'http://localhost:9090/lgn/verify/2';
  private _adminDashboardPageURL: string = 'http://localhost:9090/admin/dashboard';
  private _notificationPrefixURL: string = 'https://mobilepayments.benow.in/merchants';
  private _managerDashboardPageURL: string = 'http://localhost:9090/manager/dashboard';
  private _merchantDashboardPageURL: string = 'http://localhost:9090/merchant/dashboard';
  private _uploadsURL: string = 'https://mobilepayments.benow.in/merchants/merchant/document/15/';
 
  constructor() {
    this._status = new Status(false, false, '');
  }

  isHB(mCode: string|null): boolean {
    if(mCode === 'AL7D6' || mCode === 'ADCT7' || mCode === 'AA8A0' || mCode === 'AF4V6' || mCode === 'ADJ69' || mCode === 'AACH5')
      return true;

    return false;
  }

  public pbaseURL():string{
    return this._pbaseURL;
  }

  getRequestURL(): string {
    return  this._requestURL;
  }
  getSuccessURL(): string {
    return this._baseURL + this._succcessURL
  }

  getFailedURL(): string {
    return this._baseURL + this._failureURL;
  }
  public getProcessPaymentURL(): string {
    return this._processPaymentURL;
  }

  public getUploadsURL(): string {
    return this._uploadsURL;
  }

  public getNotificationPrefixURL(): string {
    return this._notificationPrefixURL;
  }

  public getManagerDashboardPageURL(): string {
    return this._managerDashboardPageURL;    
  }

  public getMyBizDashboardPageURL(): string {
    return this._mybizDashboardPageURL;
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

  public getLastYearDateString(): string {
    let dt = new Date();
    let yy = dt.getFullYear() - 1;
    return this.getDate(dt.getDate()) + '-' + this.getMonth(dt.getMonth()) + '-' + yy; 
  }

  public getNextYearDateString(): string {
    let dt = new Date();
    let yy = dt.getFullYear() + 1;
    return this.getDate(dt.getDate()) + '-' + this.getMonth(dt.getMonth()) + '-' + yy; 
  }

  public setStatus(isError: boolean, isSuccess: boolean, msg: string) {
    this._status.isError = isError;
    this._status.isSuccess = isSuccess;
    this._status.message = msg;
  }

  public getStatus(): Status {
    return this._status;
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

  getFileHeaders(): Headers {
    this._headers['content-type'] = 'multipart/form-data; boundary=----WebKitFormBoundaryl9Za6RFZRq8zSFxC';
    if(!this._headers['X-EMAIL'] && this._headers['X-AUTHORIZATION'] && this._uname)
      this._headers['X-EMAIL'] = this._uname;

    return this._headers;    
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

  public formatDT(dt: string, sprtr: string, useFullYear: boolean, cutSec: boolean, timeFirst: boolean): string {
    let dtd;
    let dtt;
    if(dt) {
      let dts = dt.split(' ');
      if(dts && dts.length > 0) {
        dtd = dts[0];
        let dts0s = dts[0].split('-')
        if(dts0s && dts0s.length > 2) {
          let yr = dts0s[2];
          if(yr.length > 2 && !useFullYear)
            yr = yr.substring(2);

          dtd = dts0s[0] + sprtr + dts0s[1] + sprtr + yr;
        }
      }

      if(dts && dts.length > 1) {
        dtt = dts[1];
        if(cutSec) {
          let dts1s = dts[1].split(':');
          if(dts1s && dts1s.length > 2)
            dtt = dts1s[0] + ':' + dts1s[1];
        }
      }

      if(dtd) {
        dt = dtd;
        if(dtt) {
          if(timeFirst)
            dt = dtt + ' ' + dtd;
          else
            dt = dtd + ' ' + dtt;
        }
      }
    }

    return dt;    
  }

  public isAnyMobile(): boolean {
    return (this.isAndroid() || this.isBlackBerry() || this.isiOS() || this.isOpera() || this.isWindows());
  }

  private isAndroid(): boolean {
    if(!navigator || !navigator.userAgent)
      return false;

    return navigator.userAgent.match(/Android/i) != null;
  }

  private isBlackBerry(): boolean {
    if(!navigator || !navigator.userAgent)
      return false;

    return navigator.userAgent.match(/BlackBerry/i) != null;
  }
  
  private isiOS(): boolean {
    if(!navigator || !navigator.userAgent)
      return false;

    return navigator.userAgent.match(/iPhone|iPad|iPod/i) != null;
  }

  private isOpera(): boolean {
    if(!navigator || !navigator.userAgent)
      return false;

    return navigator.userAgent.match(/Opera Mini/i) != null;
  }

  private isWindows(): boolean {
    if(!navigator || !navigator.userAgent)
      return false;

    return navigator.userAgent.match(/IEMobile/i) != null;
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