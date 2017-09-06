import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { User } from './../models/user.model';

import { UtilsService } from './utils.service';

@Injectable()
export class UserService {
  private _language: number;
  private _token: string;
  private _uname: string;
  private _user: User;  
  private _headers: any;
  
  private _isNGO: boolean = false;
  private _urls: any = {
    signIn: 'merchant/signIn',
    allocateTill: 'merchant/tillAllocate',
    releaseTill: 'merchant/tillRelease',
    sendVerificationMail: 'merchant/sendVerificationMail',
    changePassword: 'merchant/changePassword'
  }

  constructor(private http: Http, private utilsService: UtilsService) {
    this.refresh();
  }

  isLoggedIn(): boolean {
    return true;
  }

  getCurrUser(): User {
    return this._user;
  }

  getUser(): Promise<User> {
    if(!this._user) {
      if(this.hasToken()) 
        return this.isTokenValid(this.getToken());
      else
        return this.newUser();
    }
    else
      return Promise.resolve(this._user);
  }

  isNGO(): boolean {
    return this._isNGO;
  }

  setUserLanguage(lang: number) {
    if(this._user)
      this._user.language = lang;    
  }

  signIn(email: string, password: string): Promise<any> {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.signIn, 
        JSON.stringify({ 
          "data": this.utilsService.encryptPayload({ 
            "email": email, 
            "password": password 
          }, false) 
        }), 
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => this.fillUser(email, this.utilsService.decryptPayload(res.json(), false)))
      .catch(res => this.handleError(res.json()));
  }

  setToken(local: boolean, tokenObj: any) {
    if(local)
      localStorage.setItem('bnMRC', JSON.stringify(tokenObj));
    else 
      sessionStorage.setItem('bnMRC', JSON.stringify(tokenObj));

    this.refresh();
  }

  tillAllocate(til: string): Promise<any> { 
     return this.http
      .post(this.utilsService.getBaseURL() + this._urls.allocateTill, 
        JSON.stringify({ 
          "data": this.utilsService.encryptPayload({ 
             "till":til,
             "merchantCode": this._user.merchantCode,
             "employeeUserCode": this._user.tilLogin
          }, false) 
        }), 
         { headers: this.getTempHeaders() })
      .toPromise()
      .then(res => this.utilsService.decryptPayload(res.json(), false))
      .catch(res => this.handleError(res.json()));
  }

  tillRelease(til: string): Promise<any> {  
     return this.http
      .post(this.utilsService.getBaseURL() + this._urls.releaseTill, 
        JSON.stringify({ 
          "data": this.utilsService.encryptPayload({ 
             "till":til,
             "merchantCode":this._user.merchantCode
          }, false) 
        }), 
         { headers: this.getTempHeaders() })
      .toPromise()
      .then(res => this.utilsService.decryptPayload(res.json(), false))
      .catch(res => this.handleError(res.json()));
  }

  sendVerificationCode(email: string): Promise<any> {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.sendVerificationMail, 
        JSON.stringify({
          "data": this.utilsService.encryptPayload({
            "email": email, 
          }, false)
        }), 
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => this.sentMail(this.utilsService.decryptPayload(res.json(), false)))
      .catch(res => this.handleError(res.json()));
  }

  changePassword(vCode: string, pwd: string): Promise<any> {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.changePassword,
        JSON.stringify({
          "data": this.utilsService.encryptPayload({
            "email" : this._user.email,
            "verificationCode": vCode,
            "password": pwd
          }, false)
        }),
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => this.changedPassword(this.utilsService.decryptPayload(res.json(), false)))
      .catch(res => this.handleError(res.json()));
  }

  private changedPassword(res: any): any {
    if(res && res.responseFromAPI == true)
      return { 'success': true, 'errorCode': null };
    else if(res && res.validationErrors && res.validationErrors.WrongVerificationCode)
      return { 'success': false, 'errorCode': res.validationErrors.WrongVerificationCode }
    else
      return { 'success': false, 'errorCode': 'Something went wrong. Please try again.' };    
  }

  private sentMail(res: any): any {
    if(res && res.responseFromAPI == true)
      return { 'success': true, 'errorCode': null };
    else if(res && res.validationErrors && res.validationErrors.emailId)
      return { 'success': false, 'errorCode': res.validationErrors.emailId };
    else
      return { 'success': false, 'errorCode': 'Something went wrong. Please try again.' };
  }

  private getTempHeaders(): any {
    let headers: any = {
      'content-type': 'application/json',
      'X-AUTHORIZATION': this._user.token,
      'X-EMAIL': this._user.email
    };

    return new Headers(headers);
  }

  private handleError(res: any) {
    return { success: false, errorCode: res.errorCode };
  }

  private fillUserFromToken(tkn: string) {
    let ts = tkn.split('.');
    if(ts && ts.length > 1) {
      let dt = JSON.parse(atob(ts[1]));
      if(dt && dt.sub && dt.data) {
        this._user.id = dt.data.merchantId;
        this._user.displayName = dt.data.displayName;
        this._user.email = dt.sub;
        this._user.mccCode = dt.data.mccCode;
        this._user.merchantCode = dt.data.merchantCode;
        this._user.mobileNumber = dt.data.mobileNumber;
        this._user.privateId = dt.data.privateId;
        this._user.token = tkn;
        if(this._user.mccCode)
          this.setNGO(this._user.mccCode);
      }
    }
  }

  private fillUser(email: string, res: any) {    
    this._user.id = null;
    if(res && res.success !== false && res.jwtToken) {
      this.fillUserFromToken(res.jwtToken);
      if(res.employee_role) {
        this._user.tilLogin = email;
        this._user.hasTils = true;
        this._user.isTilManager = false;
        this._user.isSuperAdmin = false;
        if(res.employee_role.trim().toLowerCase() == 'benow administrator') {
          this._user.hasTils = false;
          this._user.isSuperAdmin = true;
        }
        if(res.employee_role.trim().toLowerCase() == 'benow merchant manager')
          this._user.isTilManager = true;
        else
          this._user.allTils = res.tils;
      }
    }

    return res;
  }

  private getToken(): any {
    let bnMRC: any;
    if(sessionStorage.getItem('bnMRC')) {
      bnMRC = JSON.parse((sessionStorage.getItem('bnMRC') as any).toString());
    }
    else if(localStorage.getItem('bnMRC'))
      bnMRC = JSON.parse((localStorage.getItem('bnMRC') as any).toString());

    return bnMRC;
  }

  private setNGO(mccCode: string): boolean {
    if(mccCode === '8398')
      this._isNGO = true;

    return this._isNGO;
  }

  private fillUserFromStoredToken(token: any) {
    let tkn = token.token;
    let ts = tkn.split('.');
    if(ts && ts.length > 1) {
      let dt = JSON.parse(atob(ts[1]));
      if(dt && dt.sub && dt.data) {
        this._user.id = dt.data.merchantId;
        this._user.displayName = dt.data.displayName;
        this._user.email = dt.sub;
        this._user.mccCode = dt.data.mccCode;
        this._user.merchantCode = dt.data.merchantCode;
        this._user.mobileNumber = dt.data.mobileNumber;
        this._user.privateId = dt.data.privateId;
        this._user.token = tkn;
        if(this._user.mccCode)
          this.setNGO(this._user.mccCode);
      }
    }

    this._user.isTilManager = token.isTilManager;
    this._user.hasTils = token.hasTils;
    this._user.tilLogin = token.tilLogin;
    this._user.tilNumber = token.tilNumber;
    this._user.isSuperAdmin = token.isSuperAdmin;
  }

  private isTokenValid(tkn: any): Promise<User> {
    this._user = new User(false, false, false, this._language, null, null, null, null, null, null, null, null, null, null, null);
    if(tkn && tkn.token)
      this.fillUserFromStoredToken(tkn);

    return Promise.resolve(this._user);
  }

  private newUser(): Promise<User> {
    this._user = new User(false, false, false, 0, null, null, null, null, null, null, null, null, null, null, null);
    return Promise.resolve(this._user);
  }

  private getDocTitle(lang: number) {
    switch(lang) {
      case 2:
        return 'बीनाव - व्यापारी कन्सोल';
      case 3:
        return 'बीनाव - व्यापारी कन्सोल';
      default:
        return 'benow - merchant console';      
    }
  }

  private refresh() {    
    let bnMRC: any;
    if(sessionStorage.getItem('bnMRC'))
      bnMRC = JSON.parse((sessionStorage.getItem('bnMRC') as any).toString());
    else if(localStorage.getItem('bnMRC'))
      bnMRC = JSON.parse((localStorage.getItem('bnMRC') as any).toString());

    if(bnMRC && bnMRC.token && bnMRC.username) {
      this._uname = bnMRC.username.toString();
      this._language = +bnMRC.language;        
      this._token = bnMRC.token;
      this._headers = {
        'content-type': 'application/json',
        'X-AUTHORIZATION': bnMRC.token
      };
      this.utilsService.setToken(this._token);
      this.utilsService.setUName(this._uname);
    }
    else {
      this._uname = '';
      this._token = '';
      this._language = 0;
      this._headers = {
        'content-type': 'application/json'
      };      
    }    

    this.utilsService.setHeaders(this._headers);
  }

  private hasToken(): boolean {
    if(this._uname && this._headers)
      return true;

    return false;
  }
}