import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import { Status } from '../models/status.model';
import { retry } from 'rxjs/operator/retry';

@Injectable()
export class UtilsService {
  private _uname: string;
  private _token: string;
  private _headers: any = {};
  private _status: Status;

  private _isNGO: boolean = false;
  private _initialized: boolean = false;
  private _isUnRegistered: boolean = false;
  private _isDevEnv: boolean = true;
  private _testDomainURL: string = "https://testbenowuser.benow.in/";
  private _audioFile: string = '../../assets/shared/audios/paymentreceived.wav';
  private _fixedKey: string = 'NMRCbn';
  private _baseURL: string = 'http://localhost:9090/';
  private _newbizURL: string = 'http://localhost:9090/newbiz';
  private _oldbizURL: string = 'http://localhost:9090/mybiz';
  private _buyURL: string = 'http://localhost:9090/buy/';
  private _requestURL: string = 'http://localhost:9090/paysdk';

  private _processPaymentURL: string = 'http://localhost:9090/sdk/processPayment';
  private _redirectURL: string = 'http://localhost:9090/r/';
  private _profilePageURL: string = 'http://localhost:9090/profile';
  private _tilConsoleURL: string = 'http://localhost:9090/tilconsole';
  private _invoicesPageURL: string = 'http://localhost:9090/invoices';
  private _loginPageURL: string = 'http://localhost:9090/lgn/login/1';
  private _pgURL: string = 'http://localhost:9090/cart/processPayment';
  private _oldDashboardURL: string = 'http://localhost:9090/dashboard';
  private _logoutPageURL: string = 'http://localhost:9090/lgn/logout/6';
  private _paymentLinkPageURL: string = 'http://localhost:9090/paymentlink';
  private _ngoDashboardPageURL: string = 'http://localhost:9090/ngocsl/dashboard';
  private _mybizDashboardPageURL: string = 'http://localhost:9090/mybiz/dashboard';
  private _changePasswordPageURL: string = 'http://localhost:9090/lgn/verify/2';
  private _adminDashboardPageURL: string = 'http://localhost:9090/admin/dashboard';
  private _notificationPrefixURL: string = 'https://mobilepayments.benow.in/merchants';
  private _documentsPrefixURL: string = 'https://mobilepayments.benow.in/merchants/';
  private _managerDashboardPageURL: string = 'http://localhost:9090/manager/dashboard';
  private _merchantDashboardPageURL: string = 'http://localhost:9090/merchant/dashboard';
  private _uploadsURL: string = 'https://mobilepayments.benow.in/merchants/merchant/document/15/';
  private _uploadsURL1: string = 'https://mobilepayments.benow.in/merchants/';
  // private _paytmPgUrl: string = 'https://pguat.paytm.com/oltp-web/processTransaction';
  private _paytmPgUrl: string = 'https://securegw.paytm.in/theia/processTransaction';
private _noProdImageURL: string = 'http://localhost:9090/assets/shared/images/addproducts2@2x.png';
  private _defaultStoreImageURL: string = 'http://localhost:9090/assets/paymentlink/images/paym.png';
  private _defaultStorebannerImageURL: string ='http://localhost:9090/assets/paymentlink/images/bannerdefault.png'
  private razorpay_key: string = 'rzp_live_xj14aQN4PrZQET';
  private _sysColors: Array<string> = ['brown', 'grey', 'black', 'blue', 'purple', 'green', 'pink', 'gold', 'red', 'silver', 'yellow', 'gunmetal', 
    'maroon', 'white', 'orange', 'metallic', 'beige', 'copper', 'navy', 'burgundy', 'olive', 'steel', 'charcoal', 'bronze', 'teal', 'coral', 'peach', 
    'magenta', 'lavender', 'turquoise', 'taupe', 'mauve', 'lime green', 'coffee brown', 'khaki', 'rust'];

  constructor() {
    this._status = new Status(false, false, '');
  }

  getpgURL(): string {
    return this._pgURL;    
  }
  getbuyURL(): string {
    return this._buyURL;    
  }

  getRedirectURL(): string {
    return this._redirectURL;
  }

  getTestDomainURL(): string {
    return this._testDomainURL;
  }

  getIsDevEnv(): boolean {
    return this._isDevEnv;
  }

  isHB(mCode: string | null, lob: string | null): boolean {
    if (this._isUnRegistered)
      return true;

    if (lob && (lob.trim().toUpperCase() == 'HB' || lob.trim().toUpperCase() == 'NHB'))
      return true;

    if (mCode === 'AL7D6' || mCode === 'ADCT7' || mCode === 'AA8A0' || mCode === 'AF4V6' || mCode === 'ADJ69' || mCode === 'AACH5' ||
      mCode === 'AL7I2' || mCode === 'ALA73' || mCode === 'AC149')
      return true;

    return false;
  }
  /* encryptPayload(obj: any, ut: boolean): string {
    return CryptoJS.AES.encrypt(JSON.stringify(obj), this.getKey(ut)).toString();
  }

  decryptPayload(obj: any, ut: boolean): any {
    if(obj && obj.data) {
      return JSON.parse(CryptoJS.AES.decrypt(obj.data, this.getKey(ut)).toString(CryptoJS.enc.Utf8));
    }

    return null;
  }*/


  getRequestURL(): string {
    return this._requestURL;
  }

  public getProcessPaymentURL(): string {
    return this._processPaymentURL;
  }

  public isSysColor(col: string): boolean {
    if(col && col.trim().toLowerCase() == 'navy blue')
      col = 'navy';
      
    if(col && this._sysColors.indexOf(col.trim().toLowerCase()) >= 0)
      return true;

    return false;
  }

  public getNoProdImageURL(): string {
    return this._noProdImageURL;
  }

  public getUploadsURL(): string {
    return this._uploadsURL;
  }
  public getUploadsURL1(): string {
    return this._uploadsURL1;
  }

  public getDefaultStoreImageURL(): string {
    return this._defaultStoreImageURL;
  }
 public getDefaultStorebannerImageURL(): string{
    return this._defaultStorebannerImageURL;
 }

  public getDocumentsPrefixURL(): string {
    return this._documentsPrefixURL;
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

  public getInvoicesPageURL(): string {
    return this._invoicesPageURL;
  }

  public getTilConsoleURL(): string {
    return this._tilConsoleURL;
  }

  public getProfilePageURL(): string {
    return this._profilePageURL;
  }

  public getPaymentLinkPageURL(): string {
    return this._paymentLinkPageURL;
  }

  public getOldDashboardURL(): string {
    return this._oldDashboardURL;
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

  public getDTStr(dt: Date): string {
    let yy = dt.getFullYear();
    return this.getDate(dt.getDate()) + '-' + this.getMonth(dt.getMonth()) + '-' + yy + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + 
      dt.getSeconds();    
  }

  public getCurDateString(): string {
    let dt = new Date();
    let yy = dt.getFullYear();
    return this.getDate(dt.getDate()) + '-' + this.getMonth(dt.getMonth()) + '-' + yy;
  }

  public getNextDateString(): string {
    let dt = new Date();
    let yy = dt.getFullYear();
    let day = dt.getDate() + 1;
    return this.getDate(day) + '-' + this.getMonth(dt.getMonth()) + '-' + yy;
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

  getOldBizURL(): string {
    return this._oldbizURL;
  }

  getNewBizURL(): string {
    return this._newbizURL;
  }

  getPDFHeaders(): Headers {
    let headrs: any = {};
    headrs['content-type'] = 'application/json';
    headrs['accept'] = 'application/pdf';
    if (!this._headers['X-EMAIL'] && this._headers['X-AUTHORIZATION'] && this._uname) {
      headrs['X-EMAIL'] = this._uname;
      headrs['X-AUTHORIZATION'] = this._headers['X-AUTHORIZATION'];
    }

    return new Headers(this._headers);
  }

  getHeaders(): Headers {
    this._headers['content-type'] = 'application/json';
    if (!this._headers['X-EMAIL'] && this._headers['X-AUTHORIZATION'] && this._uname)
      this._headers['X-EMAIL'] = this._uname;

    return new Headers(this._headers);
  }

  setUnregistered(u: boolean) {
    this._isUnRegistered = u;
  }

  getUnregistered(): boolean {
    return this._isUnRegistered;
  }

  getxauth(): string {
    let bnMRC: any;
    let tkstr;
    let tk: string | null = sessionStorage.getItem('bnMRC');
    if (tk)
      tkstr = tk.toString();
    else {
      tk = localStorage.getItem('bnMRC');
      if (tk)
        tkstr = tk.toString();
    }

    if (tkstr)
      bnMRC = JSON.parse(tkstr);

    if (bnMRC && bnMRC.token)
      return bnMRC.token.toString();

    return '';
  }

  getFileHeaders(): Headers {
    this._headers['content-type'] = 'multipart/form-data; boundary=----WebKitFormBoundaryl9Za6RFZRq8zSFxC';
    if (!this._headers['X-EMAIL'] && this._headers['X-AUTHORIZATION'] && this._uname)
      this._headers['X-EMAIL'] = this._uname;

    return this._headers;
  }

  getBaseURL(): string {
    return this._baseURL;
  }

  getDocTitle(lang: number, title: string) {
    if (title == 'Benow - Get UPI/BHIM Enabled Now') {
      switch (lang) {
        case 2:
          return 'बीनाव - यूपीआई/भीम अब सक्षम करें';
        case 3:
          return 'बीनाव - आता यूपीआई/भिम सक्षम करा';
        default:
          return 'Benow - Get UPI/BHIM Enabled Now';
      }
    }
    else if (title == 'benow - admin console') {
      switch (lang) {
        case 2:
          return 'बीनाव - प्रशासन कन्सोल';
        case 3:
          return 'बीनाव - प्रशासन कन्सोल';
        default:
          return 'Benow - Admin Console';
      }
    }
    else if (title == 'benow - ngo console') {
      switch (lang) {
        case 2:
          return 'बीनाव - एनजीओ कन्सोल';
        case 3:
          return 'बीनाव - एनजीओ कन्सोल';
        default:
          return 'Benow - NGO Console';
      }
    }
    else {
      switch (lang) {
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
    switch (langId) {
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
    return { "success": false, "errMsg": "Something went wrong. Please try again." };
  }

  inWords(totalRent: any) {
    let rupeePrefix: string = 'rupees ';
    let paisaPrefix: string = 'paise';
    let and: string = 'and ';
    if (totalRent >= 1 && totalRent < 2)
      rupeePrefix = 'rupee ', '';

    if (totalRent < 1) {
      and = '';
      rupeePrefix = '';
    }

    if ((Math.round(totalRent * 100) % 100) >= 1 && (Math.round(totalRent * 100) % 100) < 2) {
      paisaPrefix = 'paisa';
    }

    var n: any;
    var d: any;
    var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    var b = ['', '', 'twenty', 'thirty', 'fourty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    var number = parseFloat(totalRent).toFixed(2).split(".");
    var num = parseInt(number[0]);
    var digit = parseInt(number[1]);
    if ((num.toString(n)).length > 9)
      return 'overflow';

    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    d = ('00' + digit).substr(-2).match(/^(\d{2})$/);;
    if (!n) return; var str = '';

    str += rupeePrefix, '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : ' ';

    str += (d[1] != 0) ? ((str != '') ? and : '') + (a[Number(d[1])] || b[d[1][0]] + ' ' + a[d[1][1]]) + paisaPrefix + ' only ' : 'only';
    return str;
  }

  getDateOnlyString(dt: Date): string {
    return this.getDate(dt.getDate()) + '/' + this.getMonth(dt.getMonth()) + '/' + dt.getFullYear();
  }

  isNGO(mccCode: string|null, lob: string|null): boolean {
    if (mccCode === '8398' || (lob && lob.toUpperCase() == 'NGO' ))
      this._isNGO = true;
      
    return this._isNGO;
  }

  getDateTimeString(dt: Date): string {
    return this.getDate(dt.getDate()) + '/' + this.getMonth(dt.getMonth()) + '/' + dt.getFullYear() + ' ' + this.getHoursOrMinutes(dt.getHours())
      + ':' + this.getHoursOrMinutes(dt.getMinutes());
  }

  clearStorages() {
    localStorage.removeItem('bnMRC');
    sessionStorage.removeItem('bnMRC');
  }

  setLanguageInStorage(lang: number) {
    let sbnMRCObj = sessionStorage.getItem('bnMRC');
    if (sbnMRCObj) {
      let sbnMRC = JSON.parse(sbnMRCObj);
      if (sbnMRC && sbnMRC.token && sbnMRC.username) {
        sbnMRC.language = lang;
        sessionStorage.setItem('bnMRC', JSON.stringify(sbnMRC));
      }
    }

    let lbnMRCObj = localStorage.getItem('bnMRC');
    if (lbnMRCObj) {
      let lbnMRC = JSON.parse(lbnMRCObj);
      if (lbnMRC && lbnMRC.token && lbnMRC.username) {
        lbnMRC.language = lang;
        localStorage.setItem('bnMRC', JSON.stringify(lbnMRC));
      }
    }
  }

  setLOBInStorage(lob: string) {
    let sbnMRCObj = sessionStorage.getItem('bnMRC');
    if (sbnMRCObj) {
      let sbnMRC = JSON.parse(sbnMRCObj);
      if (sbnMRC) {
        sbnMRC.lob = lob;
        sessionStorage.setItem('bnMRC', JSON.stringify(sbnMRC));
      }
    }

    let lbnMRCObj = localStorage.getItem('bnMRC');
    if (lbnMRCObj) {
      let lbnMRC = JSON.parse(lbnMRCObj);
      if (lbnMRC) {
        lbnMRC.lob = lob;
        localStorage.setItem('bnMRC', JSON.stringify(lbnMRC));
      }
    }
  }

  public formatDT(dt: string, sprtr: string, useFullYear: boolean, cutSec: boolean, timeFirst: boolean): string {
    let dtd;
    let dtt;
    if (dt) {
      let dts = dt.split(' ');
      if (dts && dts.length > 0) {
        dtd = dts[0];
        let dts0s = dts[0].split('-')
        if (dts0s && dts0s.length > 2) {
          let yr = dts0s[2];
          if (yr.length > 2 && !useFullYear)
            yr = yr.substring(2);

          dtd = dts0s[0] + sprtr + dts0s[1] + sprtr + yr;
        }
      }

      if (dts && dts.length > 1) {
        dtt = dts[1];
        if (cutSec) {
          let dts1s = dts[1].split(':');
          if (dts1s && dts1s.length > 2)
            dtt = dts1s[0] + ':' + dts1s[1];
        }
      }

      if (dtd) {
        dt = dtd;
        if (dtt) {
          if (timeFirst)
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
    if (!navigator || !navigator.userAgent)
      return false;

    return navigator.userAgent.match(/Android/i) != null;
  }

  private isBlackBerry(): boolean {
    if (!navigator || !navigator.userAgent)
      return false;

    return navigator.userAgent.match(/BlackBerry/i) != null;
  }

  private isiOS(): boolean {
    if (!navigator || !navigator.userAgent)
      return false;

    return navigator.userAgent.match(/iPhone|iPad|iPod/i) != null;
  }

  private isOpera(): boolean {
    if (!navigator || !navigator.userAgent)
      return false;

    return navigator.userAgent.match(/Opera Mini/i) != null;
  }

  private isWindows(): boolean {
    if (!navigator || !navigator.userAgent)
      return false;

    return navigator.userAgent.match(/IEMobile/i) != null;
  }

  private getHoursOrMinutes(h: number) {
    if (h < 10)
      return '0' + h.toString();

    return h.toString();
  }

  private getDate(d: number) {
    if (d < 10)
      return '0' + d.toString();

    return d.toString();
  }

  private getMonth(m: number) {
    let mon: number = m + 1;
    if (mon < 10)
      return '0' + mon.toString();

    return mon.toString();
  }

  private getKey(ut: boolean): string {
    if (ut && this._token)
      return this._token;
    else
      return this._fixedKey;
  }

  b64toBlob(b64Data: any, contentType: any, sliceSize: any) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }


  playAudio() {
    let ado: any = new Audio(this._audioFile);
    if (ado) {
      ado.muted = false;
      ado.play();
    }
  }

  startAudio() {
    if (!this._initialized && this.isAnyMobile()) {
      let ado: any = new Audio(this._audioFile);
      if (ado) {
        ado.muted = true;
        ado.play();
        this._initialized = true;
      }
    }
  }

  convertImgToBase64URL(url: any, outputFormat: any, callback: any) {
    console.log('coming in utils?', url);
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      var canvas: any = document.createElement("canvas");
      //console.log('canvas', canvas);
      var ctx = canvas.getContext("2d");
      // console.log('ctx', ctx);
      var dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 10, 10);
      dataURL = canvas.toDataURL(outputFormat);
      // console.log('pp', dataURL);
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  }

  getPaytmPgUrl(): string {
    return this._paytmPgUrl;
  }

}