import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { User } from './../models/user.model';
import { Businesspro } from './../models/businesspro.model';
import { Accountpro } from './../models/accountpro.model';
import { Customer } from "../models/customer.model";
import { CustomerList } from "../models/customerlist.model";
import { Merchant } from "../models/merchant.model";
import { BusinessCategory } from '../models/businesscategory.model';
import { BusinessType } from '../models/businesstype.model';

import { UtilsService } from './utils.service';

@Injectable()
export class UserService {
  private _language: number;
  private _token: string;
  private _uname: string;
  private _user: User;
  private _businesspro: Businesspro;
  private _accountpro: Accountpro;
  private _headers: any;
  private _customer: Array<Customer>;
  private _customerList: CustomerList;
  private _merchantmodel: Merchant;
  private _isNGO: boolean = false;
  private _merchant: any;
  private _businessType: BusinessType[];
  private _businessCategory: BusinessCategory[];
  private _urls: any = {
    signIn: 'user/signIn',
    allocateTill: 'merchant/tillAllocate',
    releaseTill: 'merchant/tillRelease',
    sendVerificationMail: 'merchant/sendVerificationMail',
    changePassword: 'merchant/changePassword',
    getCustomerList: 'user/getCustomerList',
    markSelfMerchantVerified: 'user/markSelfMerchantVerified',
    registerSelfMerchant: 'user/registerSelfMerchant',
    checkMerchant: 'user/check',
    fetchmerchantdetail: 'user/fetchmerchantdetail',
    getSetConvenienceFeeURL: 'user/setConvenienceFee',
    getMerchantDetails: 'user/getMerchantDetails',
    getBusinessType: 'user/getBusinessType',
    getDashboardCategories: 'user/getDashboardCategories',
    getSubcategoryByCategory: 'user/getSubcategoryByCategory',
    getEnableKyc: 'user/EnableKyc',
    getcomplteregister: 'user/complteregister',
    setLineOfBusiness: 'user/setLineOfBusiness',
    changePasswordURL: 'user/changeoldpassword'
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
    if (!this._user) {
      if (this.hasToken())
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

  getCustomerList(merchantCode: string, pageNumber: number) {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.getCustomerList,
        JSON.stringify({
          "merchantCode": merchantCode,
          "pageNumber": pageNumber
        }),
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => this.fillCustomer(res.json()))
      .catch(res => this.handleError(res.json()));
  }

  setUserLanguage(lang: number) {
    if (this._user)
      this._user.language = lang;
  }

  signIn(email: string, password: string): Promise<any> {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.signIn,
        JSON.stringify({
          "email": email,
          "password": password
        }),
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => this.fillUser(email, res.json()))
      .catch(res => this.handleError(res.json()));
  }

  setToken(local: boolean, tokenObj: any) {
    if (local)
      localStorage.setItem('bnMRC', JSON.stringify(tokenObj));
    else
      sessionStorage.setItem('bnMRC', JSON.stringify(tokenObj));

    this.refresh();
  }

  tillAllocate(til: string): Promise<any> {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.allocateTill,
        JSON.stringify({
          "till": til,
          "merchantCode": this._user.merchantCode,
          "employeeUserCode": this._user.tilLogin
        }),
        { headers: this.getTempHeaders() })
      .toPromise()
      .then(res => res.json())
      .catch(res => this.handleError(res.json()));
  }

  tillRelease(til: string | null): Promise<any> {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.releaseTill,
        JSON.stringify({
          "till": til,
          "merchantCode": this._user.merchantCode
        }),
        { headers: this.getTempHeaders() })
      .toPromise()
      .then(res => res.json())
      .catch(res => this.handleError(res.json()));
  }

  sendVerificationCode(email: string): Promise<any> {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.sendVerificationMail,
        JSON.stringify({
          "email": email,
        }),
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => this.sentMail(res.json()))
      .catch(res => this.handleError(res.json()));
  }

  changePassword(vCode: string, pwd: string): Promise<any> {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.changePassword,
        JSON.stringify({
          "email": this._user.email,
          "verificationCode": vCode,
          "password": pwd
        }),
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => this.changedPassword(res.json()))
      .catch(res => this.handleError(res.json()));
  }

  resetUser() {
    this._user = new User(false, false, false, false, this._user.language, null, null, null, null, null, null, null, null, null, null, null, null, false, false, false);
  }

  private changedPassword(res: any): any {
    if (res && res.responseFromAPI == true)
      return { 'success': true, 'errorCode': null };
    else if (res && res.validationErrors && res.validationErrors.WrongVerificationCode)
      return { 'success': false, 'errorCode': res.validationErrors.WrongVerificationCode }
    else
      return { 'success': false, 'errorCode': 'Something went wrong. Please try again.' };
  }

  private sentMail(res: any): any {
    if (res && res.responseFromAPI == true)
      return { 'success': true, 'errorCode': null };
    else if (res && res.validationErrors && res.validationErrors.emailId)
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

  fillUnregisteredUser(token: any) {
    this._user.displayName = token.displayName;
    this._user.email = token.email;
    this._user.mccCode = token.mccCode;
    this._user.merchantCode = token.merchantCode;
    this._user.mobileNumber = token.mobileNumber;
    this._user.id = token.userid ? token.userid.toString() : '';
    this._user.lob = token.lob;
    this._user.language = token.language;
    this._user.isTilManager = token.isTilManager;
    this._user.hasTils = token.hasTils;
    this._user.tilLogin = token.tilLogin;
    this._user.tilNumber = token.tilNumber;
    this._user.isSuperAdmin = token.isSuperAdmin;
    this._user.isSuperMerchant = token.isSuperMerchant;
    this.utilsService.isNGO(this._user.mccCode);
    this.utilsService.setUnregistered(true);
  }

  private fillUserFromToken(tkn: string) {
    let ts = tkn.split('.');
    if (ts && ts.length > 1) {
      let dt = JSON.parse(atob(ts[1]));
      if (dt && dt.sub && dt.data) {
        this._user.id = dt.data.merchantId;
        this._user.displayName = dt.data.displayName;
        this._user.email = dt.sub;
        this._user.mccCode = dt.data.mccCode;
        this._user.merchantCode = dt.data.merchantCode;
        this._user.mobileNumber = dt.data.mobileNumber;
        this._user.privateId = dt.data.privateId;
        this._user.token = tkn;
        if (this._user.mccCode)
          this.setNGO(this._user.mccCode);
      }
    }
  }

  private fillUser(email: string, res: any): any {
    this._user.id = null;
    if (res && res.success !== false) {
      if (res.jwtToken) {
        this._user.registerd = true;
        this._user.lob = res.business_lob;
        this.fillUserFromToken(res.jwtToken);

        if (res.employee_role) {
          this._user.tilLogin = email;
          this._user.hasTils = true;
          this._user.isTilManager = false;
          this._user.isSuperAdmin = false;
          if (res.employee_role.trim().toLowerCase() == 'benow administrator') {
            this._user.hasTils = false;
            this._user.isSuperAdmin = true;
          }
          if (res.employee_role.trim().toLowerCase() == 'benow merchant manager')
            this._user.isTilManager = true;
          else
            this._user.allTils = res.tils;
        }
      }
      else if (res.merchant) {
        if (res.merchant.registrationState == 'VERIFIED') {
          this._user.registerd = true;
        }
        if (res.merchant.registrationState == null) {
          this._user.registerd = false;
        }
        this._user.kycverified = res.merchant.kycVerified;
        this._user.lessTwentyLakh = res.merchant.lessTwentyLakh;
        this._user.lob = res.merchant.businessLob ? res.merchant.businessLob : 'HB';
        this._user.id = res.merchant.id ? res.merchant.id.toString() : '';
        this._user.displayName = res.merchant.displayName;
        this._user.email = res.merchant.emailId;
        this._user.mccCode = res.merchant.mccCode;
        this._user.merchantCode = res.merchant.merchantCode;
        this._user.mobileNumber = res.merchant.mobileNumber;
        this.utilsService.isNGO(this._user.mccCode);
        this.utilsService.setUnregistered(true);
      }
    }

    return res;
  }

  private fillCustomer(res: any): CustomerList {
    console.log('Customer', res);
    if (res && res.customerList) {
      this._customer = new Array<Customer>();
      for (let i: number = 0; i < res.customerList.length; i++) {
        this._customer.push(new Customer(res.customerList[i].customerName, res.customerList[i].customerEmail,
          res.customerList[i].customerMobileNumber, res.customerList[i].noOfDonation, res.customerList[i].totalDonation,
          res.customerList[i].lastDonationDate));
      }
      this._customerList = new CustomerList(res.totalElements, res.totalNoOfPages, this._customer);
    }
    else {
      this._customer = [];
    }

    return this._customerList;
  }

  private getToken(): any {
    let bnMRC: any;
    if (sessionStorage.getItem('bnMRC')) {
      bnMRC = JSON.parse((sessionStorage.getItem('bnMRC') as any).toString());
    }
    else if (localStorage.getItem('bnMRC'))
      bnMRC = JSON.parse((localStorage.getItem('bnMRC') as any).toString());

    return bnMRC;
  }

  private setNGO(mccCode: string): boolean {
    if (mccCode === '8398')
      this._isNGO = true;

    return this._isNGO;
  }

  private fillUserFromStoredToken(token: any) {
    let tkn = token.token;
    let ts = tkn.split('.');
    if (ts && ts.length > 1) {
      let dt = JSON.parse(atob(ts[1]));
      if (dt && dt.sub && dt.data) {
        this._user.displayName = dt.data.displayName;
        this._user.email = dt.sub;
        this._user.mccCode = dt.data.mccCode;
        this._user.merchantCode = dt.data.merchantCode;
        this._user.mobileNumber = dt.data.mobileNumber;
        this._user.privateId = dt.data.privateId;
        this._user.token = tkn;
        if (this._user.mccCode)
          this.setNGO(this._user.mccCode);
      }
    }

    this._user.id = token.userid;
    this._user.lob = token.lob;
    this._user.isTilManager = token.isTilManager;
    this._user.hasTils = token.hasTils;
    this._user.tilLogin = token.tilLogin;
    this._user.tilNumber = token.tilNumber;
    this._user.isSuperAdmin = token.isSuperAdmin;
  }

  private isTokenValid(tkn: any): Promise<User> {
    this._user = new User(false, false, false, false, this._language, null, null, null, null, null, null, null, null, null, null, null, null, false, false, false);
    if (tkn) {
      if (tkn.token)
        this.fillUserFromStoredToken(tkn);
      else
        this.fillUnregisteredUser(tkn);
    }

    return Promise.resolve(this._user);
  }

  private newUser(): Promise<User> {
    this._user = new User(false, false, false, false, 0, null, null, null, null, null, null, null, null, null, null, null, null, false, false, false);
    return Promise.resolve(this._user);
  }

  private getDocTitle(lang: number) {
    switch (lang) {
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
    if (sessionStorage.getItem('bnMRC'))
      bnMRC = JSON.parse((sessionStorage.getItem('bnMRC') as any).toString());
    else if (localStorage.getItem('bnMRC'))
      bnMRC = JSON.parse((localStorage.getItem('bnMRC') as any).toString());

    if (bnMRC && bnMRC.token && bnMRC.username) {
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
      if (bnMRC && bnMRC.isUnregistered) {
        this._uname = bnMRC.displayName;
        this._language = +bnMRC.language;
        this._headers = {
          'content-type': 'application/json',
        };
        if (window.location.href.indexOf('/pay/') < 1 || window.location.href.indexOf('/donate/') < 1)
          (document as any).title = this.getDocTitle(this._language);
      }
      else {
        this._uname = '';
        this._token = '';
        this._language = 0;
        this._headers = {
          'content-type': 'application/json'
        };
      }
    }

    this.utilsService.setHeaders(this._headers);
  }

  private hasToken(): boolean {
    if (sessionStorage.getItem('bnMRC'))
      return true;
    else if (localStorage.getItem('bnMRC'))
      return true;

    return false;
  }

  registerSelfMerchant(id: string, businessName: string, contactEmailId: string, category: string,
    subCategory: string, city: string, locality: string, contactPerson: string, address: string,
    contactMobileNumber: string, businessTypeCode: string, businessType: string, pinCode: string, gstno: string,
    contactSeller: boolean, noReturnExchange: boolean, productExchange: boolean, productExchangeDay: string, productReturnOrExchange: boolean,
    productReturnOrExchangeDay: string, returnAvailable: boolean, returnsAvailableDay: string, noExchangeFlage: boolean,
    noReturnFlage: boolean, publicPhoneNumber: string, publicEmail: string, storeUrl: string, storeImgUrl: string,
    shipTimeType: string, shipTimeInterval: string, allOverIndia: boolean, selectLocalities: boolean,
    area: string, freeShip: boolean, chargePerOrder: boolean, orderShipCharge: string, chargePerProd: boolean) {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.registerSelfMerchant,
        JSON.stringify({
          "id": id,
          "gstNumber": gstno,
          "businessName": businessName,
          "contactEmailId": contactEmailId,
          "category": category,
          "subCategory": subCategory,
          "city": city,
          "locality": locality,
          "contactPerson": contactPerson,
          "address": address,
          "contactMobileNumber": contactMobileNumber,
          "businessTypeCode": businessTypeCode,
          "businessType": businessType,
          "pinCode": pinCode,
          "contactSeller": contactSeller,
          "noReturnExchange": noReturnExchange,
          "productExchange": productExchange,
          "productExchangeDay": productExchangeDay,
          "productReturnOrExchange": productReturnOrExchange,
          "productReturnOrExchangeDay": productReturnOrExchangeDay,
          "returnAvailable": returnAvailable,
          "returnsAvailableDay": returnsAvailableDay,
          "noExchangeFlage": noExchangeFlage,
          "noReturnFlage": noReturnFlage,
          "publicPhoneNumber": publicPhoneNumber,
          "publicEmail": publicEmail,
          "storeUrl": storeUrl,
          "storeImgUrl": storeImgUrl,
          "shipTimeType": shipTimeType,
          "shipTimeInterval": shipTimeInterval,
          "allOverIndia": allOverIndia,
          "selectLocalities": selectLocalities,

          "listLocalityVOs": [{
            "area": area
          },
          {
            "area": area
          },
          {
            "area": area
          }],

          "freeShip": freeShip,
          "chargePerOrder": chargePerOrder,
          "orderShipCharge": orderShipCharge,
          "chargePerProd": chargePerProd

        }),
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => this.fillMerchantProfile(res.json()))
      .catch(res => false);
  }

  markSelfMerchantVerified(id: string, ifsc: string, accountRefNumber: string, panNumber: string,
    bankName: string, merchantName: string, accountHolderName: string, filePassword: string) {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.markSelfMerchantVerified,
        JSON.stringify({

          "id": id,
          "ifsc": ifsc,
          "accountRefNumber": accountRefNumber,
          "panNumber": panNumber,
          "bankName": bankName,
          "merchantName": merchantName,
          "accountHolderName": accountHolderName,
          "filePassword": filePassword

        }),
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => this.fillAccountProfile(res.json()))
      .catch(res => false);
  }
  fillMerchantProfile(res: any): Businesspro | null {

    if (res.merchantUser.registrationState == 'VERIFIED') {
      this._user.registerd = true;
    }
    if (res.merchantUser.registrationState == null) {
      this._user.registerd = false;
    }
    if (res.merchantUser.kycVerified == null) {
      this._user.kycverified = false;
    }
    if (res.merchantUser.kycVerified == true) {
      this._user.kycverified = res.merchantUser.kycVerified;
    }
    if (res.merchantUser) {
      let pt = res.merchantUser;
      this._businesspro = new Businesspro(pt.businessName, pt.businessType, pt.category, pt.subCategory, pt.contactPerson,
        pt.address, pt.numberOfOutlets, pt.contactPersonDesignation, pt.city, pt.contactEmailId, pt.locality, pt.businessTypeCode, pt.pinCode, pt.gstNumber,
        pt.contactSeller, pt.noReturnExchange, pt.productExchange, pt.productExchangeDay, pt.productReturnOrExchange, pt.productReturnOrExchangeDay, pt.returnAvailable,
        pt.returnsAvailableDay, pt.noExchangeFlage, pt.noReturnFlage, pt.publicPhoneNumber, pt.publicEmail, pt.storeUrl, pt.storeImgUrl,
        pt.shipTimeType, pt.shipTimeInterval,pt.allOverIndia, pt.selectLocalities,
        pt.area, pt.freeShip, pt.chargePerOrder, pt.orderShipCharge, pt.chargePerProd);
    }
    return this._businesspro;
  }

  fillAccountProfile(res: any): Accountpro | null {
    if (res.merchantUser.registrationState == 'VERIFIED') {
      this._user.registerd = true;
    }
    if (res.merchantUser.registrationState == null) {
      this._user.registerd = false;
    }
    if (res.merchantUser.kycVerified == null) {
      this._user.kycverified = false;
    }
    if (res.merchantUser.kycVerified == true) {
      this._user.kycverified = res.merchantUser.kycVerified;
    }
    if (res.merchantUser) {
      let pt1 = res.merchantUser;
      this._accountpro = new Accountpro(pt1.panNumber, pt1.accountHolderName, pt1.accountRefNumber
        , pt1.ifsc, pt1.bankName, pt1.filePassword);
    }

    return this._accountpro;
  }
  checkMerchant(mobileNumber: string, profile: string): Promise<any> {
    if (profile == "b") {
      return this.http
        .post(this.utilsService.getBaseURL() + this._urls.checkMerchant,
          JSON.stringify({
            "mobileNumber": mobileNumber
          }),
          { headers: this.utilsService.getHeaders() })

        .toPromise()
        .then(res => this.fillMerchantProfile(res.json()))
        .catch(res => false);
    }
    else {
      return this.http
        .post(this.utilsService.getBaseURL() + this._urls.checkMerchant,
          JSON.stringify({
            "mobileNumber": mobileNumber
          }),
          { headers: this.utilsService.getHeaders() })

        .toPromise()
        .then(res => this.fillAccountProfile(res.json()))
        .catch(res => false);
    }
  }
  getfetchMerchantForEditDetails(email: string, Id: string): Promise<any> {

    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.checkMerchant,
        JSON.stringify({

          "userId": email,
          "sourceId": Id,
          "sourceType": "MERCHANT_REG"// hard code

        }),
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => this.fillAllgetfetchMerchantForEditDetails(res.json()))
      .catch(res => false);
  }

  fillAllgetfetchMerchantForEditDetails(res: any): Merchant {

    let dt = res;
    let me = this;

    if (dt) {
      this._merchantmodel = new Merchant(dt.address, dt.userId, dt.pinCode, dt.locality, dt.mobileNumber, dt.panNumber, dt.businessName, dt.merchantLogoUrl, dt.ngoCertifdate, dt.ngoCertifnum, dt.auto80GEnabled);
    }
    return me._merchantmodel;
  }

  setConvenienceFee(id: string, flag: boolean): Promise<boolean> {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.getSetConvenienceFeeURL,
        JSON.stringify({

          "id": id,
          "chargeConvenienceFee": flag

        }),
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => res.json())
      .catch(res => null);
  }

  getMerchantDetails(merchantCode: string): Promise<any> {
    if (this._merchant)
      return Promise.resolve(this._merchant);
    else
      return this.http
        .post(this.utilsService.getBaseURL() + this._urls.getMerchantDetails,
          JSON.stringify({
            "merchantCode": merchantCode
          }),
          { headers: this.utilsService.getHeaders() })
        .toPromise()
        .then(res => res.json())
        .catch(res => this.handleError(res.json()));
  }

  getDashboardCategories(): Promise<any> {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.getDashboardCategories,
        JSON.stringify({

        }),
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => this.fillBusinessCat(res.json()))
      .catch(res => this.handleError(res.json()));
  }

  getBusinessType(): Promise<any> {
    return this.http.get(
      this.utilsService.getBaseURL() + this._urls.getBusinessType,
      {
        headers: this.utilsService.getHeaders()
      })
      .toPromise()
      .then(res => this.fillBusinessType(res.json()))
      .catch(res => this.handleError(res.json()));
  }


  fillBusinessCat(res: any): Array<BusinessCategory> {
    let dt1 = res.data
    let dt = dt1.categoryDetails;
    let me = this;
    if (dt && dt.length > 0) {
      this._businessCategory = new Array<BusinessCategory>();
      dt.forEach(function (i: any) {
        me._businessCategory.push(new BusinessCategory(i.categoryName));
      });
    }
    return me._businessCategory;
  }

  fillBusinessType(res: any): Array<BusinessType> {
    let dt = res.data;
    let dt1 = dt.data;
    let me = this;
    if (dt1 && dt1.length > 0) {

      this._businessType = new Array<BusinessType>();
      dt1.forEach(function (i: any) {
        me._businessType.push(new BusinessType(i.code, i.description));
      });
    }
    return me._businessType;
  }

  enableKyc(merchantCode: string): Promise<any> {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.getEnableKyc,
        JSON.stringify({
          "merchantCode": this._user.merchantCode
        }),
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => res.json())
      .catch(res => null);
  }

  MerchantCompleteRegistration(): Promise<any> {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.getcomplteregister,
        JSON.stringify({
          "id": this._user.id
        }),
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => res.json())
      .catch(res => this.handleError(res.json()));
  }
  setLineOfBusiness(lob: string): Promise<any> {
    if (lob) {
      this.utilsService.setLOBInStorage(lob);
      return this.http
        .post(this.utilsService.getBaseURL() + this._urls.setLineOfBusiness,
          JSON.stringify({
            "id": this._user.id,
            "businessLob": lob
          }),
          { headers: this.utilsService.getHeaders() })
        .toPromise()
        .then(res => res.json())
        .catch(res => this.handleError(res.json()));
    }
    else
      return Promise.resolve(null);
  }

  changeoldpassword(oldpass: string, newpass: string): Promise<any> {
    return this.http
      .post(this.utilsService.getBaseURL() + this._urls.changePasswordURL,
        JSON.stringify({
          "id": this._user.id,
          "oldPassword": oldpass,
          "newPassword": newpass
        }),
        { headers: this.utilsService.getHeaders() })
      .toPromise()
      .then(res => res.json())
      .catch(res => this.handleError(res.json()));
  }


}