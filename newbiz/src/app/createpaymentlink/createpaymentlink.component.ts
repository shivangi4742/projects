import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from 'ng2-translate';

import { UtilsService, User, UserService, Businesspro, ProductService, Accountpro, CampaignService, SDKService, Status, LocationService } from 'benowservices';


@Component({
  selector: 'app-createpaymentlink',
  templateUrl: './createpaymentlink.component.html',
  styleUrls: ['./createpaymentlink.component.css']
})
export class CreatepaymentlinkComponent implements OnInit {
  businesspro: Businesspro;
  streurlpay: string;
  urlstore: string;
  dateParams: any;
  user: User;
  dashboard: string = "/dashboard";
  sampleDate: any;
  purpose: string;
  amount: number;
  invoiceNum: string;
  detailsExpanded: boolean = false;
  isAmountLess: boolean = false;
  isCopied1: boolean = false;
  email: string;
  mobileNumber: string;
  smstext: boolean = false;
  text: string;
  suceessmsg: boolean = false;
  url: string;
  smsucess: boolean = false;
  subject: string;
  payshare: boolean = false;
  emailtext: boolean = false;
  streurlpre: string;
  streurlpaypre: string;
  urlstorepre: string;
  today: string = 'Today';
  close: string = 'Close';
  clear: string = 'Clear';
  todayX: string = 'Today';
  closeX: string = 'Close';
  clearX: string = 'Clear';
  labelMonthNext: string = 'Next month';
  labelMonthNextX: string = 'Next month';
  labelMonthPrev: string = 'Previous month';
  labelYearSelect: string = 'Select a year';
  labelMonthPrevX: string = 'Previous month';
  labelYearSelectX: string = 'Select a year';
  labelMonthSelect: string = 'Select a month';
  labelMonthSelectX: string = 'Select a month';
  weekdaysShort: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekdaysShortX: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekdaysFull: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  weekdaysFullX: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthsShort: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthsShortX: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthsFull: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthsFullX: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


  constructor(private translate: TranslateService, private utilsService: UtilsService,
    private userService: UserService, private router: Router, private locationService: LocationService,
    private route: ActivatedRoute, private sdkService: SDKService, private CampaignService: CampaignService) { }

  private translateCalStrings(res: any, langCh: boolean) {
    this.today = res[this.todayX];
    this.close = res[this.closeX];
    this.clear = res[this.clearX];
    this.labelMonthNext = res[this.labelMonthNextX];
    this.labelMonthPrev = res[this.labelMonthPrevX];
    this.labelYearSelect = res[this.labelYearSelectX];
    this.labelMonthSelect = res[this.labelMonthSelectX];
    let me = this;
    this.monthsFull = new Array<string>();
    this.monthsFullX.forEach(function (m) { me.monthsFull.push(res[m]) });
    this.monthsShort = new Array<string>();
    this.monthsShortX.forEach(function (m) { me.monthsShort.push(res[m]) });
    this.weekdaysFull = new Array<string>();
    this.weekdaysFullX.forEach(function (w) { me.weekdaysFull.push(res[w]) });
    this.weekdaysShort = new Array<string>();
    this.weekdaysShortX.forEach(function (w) { me.weekdaysShort.push(res[w]) });
  }

  private dtClosed() {

  }

  ngOnInit() {
    this.locationService.setLocation('createpaylink');
    this.userService.getUser()
      .then(res => this.init(res));
    let me = this;
    this.dateParams = [{
      format: 'dd-mm-yyyy', closeOnSelect: true, selectMonths: true, selectYears: 2, min: this.utilsService.getNextDateString(), monthsFull: this.monthsFull,
      monthsShort: this.monthsShort, weekdaysFull: this.weekdaysFull, weekdaysLetter: this.weekdaysShort, showWeekdaysFull: false, today: this.today,
      close: this.close, clear: this.clear, labelMonthNext: this.labelMonthNext, labelMonthPrev: this.labelMonthPrev,
      labelMonthSelect: this.labelMonthSelect, labelYearSelect: this.labelYearSelect, onClose: function () { me.dtClosed(); }
    }];
  }
  init(res: User) {
    this.user = res;
    this.userService.checkMerchant(this.user.mobileNumber, 'b')
      .then(bres => this.initshare(bres));
  }
  initshare(res: any) {
    if (res) {
      this.businesspro = res;
    }
    this.share();
  }
  share() {
    if (this.businesspro.storeUrl) {
      this.businesspro.storeUrl = (this.businesspro.storeUrl).toLowerCase();
      this.streurlpay = this.businesspro.storeUrl + ".benow.in/pay";
      this.urlstore = this.businesspro.storeUrl + ".benow.in/store";

      this.streurlpre = "https://" + this.businesspro.storeUrl + ".benow.in";
      this.streurlpaypre = "https://" + this.businesspro.storeUrl + ".benow.in/pay";
      this.urlstorepre = "https://" + this.businesspro.storeUrl + ".benow.in/store";

    }
    else {
      var t = this.utilsService.getBaseURL() + "buy/" + this.user.merchantCode;
      this.streurlpay = t+ "/homepage";
      this.urlstore = t+ "/homepage";

      this.streurlpre = t+ "/homepage";
      this.streurlpaypre = t + "/pay";
      this.urlstorepre = t + "/store";
    }
  }
  getStatus(): Status {
    return this.utilsService.getStatus();
  }

  arrowChange() {
    this.detailsExpanded = !this.detailsExpanded;
  }

  changeIcon() {
    let a: any = document.getElementById('advance');
    a.click();
    this.arrowChange();
  }

  changeIconMob() {
    let a: any = document.getElementById('advanceMob');
    a.click();
    this.arrowChange();
  }

  dateClickedMob() {
    let a: any = document.getElementById('expDtMob');
    a.click();
  }

  dateClickedDesk() {
    let a: any = document.getElementById('expDt');
    a.click();
  }

  checkAmount() {
  
    if (this.amount != null && this.amount < 10) {
      this.isAmountLess = true;
    }
    else {
      this.isAmountLess = false;
    }

  }

  isCreated(res: any) {
    if (res) {
      this.router.navigateByUrl('/successpaylink/' + res.amount);
    }
    else {
      alert('Error in creating Payment Link!');
    }
  }

  onSubmit() {
    this.sdkService.createPaymentLink(this.user.merchantCode, this.purpose, this.amount, this.invoiceNum, this.sampleDate)
      .then(res => this.isCreated(res));
  }

  validateForm(): boolean {

    if (this.purpose && !this.isAmountLess) {
      return true;
    }
    else if (!this.purpose) {
      return false;
    }
    return false;
  }
  sharej() {
     if(this.businesspro.storeUrl) {
      this.url = this.businesspro.storeUrl + ".benow.in/pay";
      } else{
        this.url = this.utilsService.getBaseURL() + "buy/" + this.user.merchantCode +"/pay" ;
      }
    this.payshare = !this.payshare;
  }
  fbClick() {
    this.suceessmsg = false;
    this.emailtext = false;
    this.smsucess = false;
    this.smstext = false;
    window.open('https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&u=' +
      this.url + '&display=popup&ref=plugin&src=share_button', '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    return false;
  }
  twitterbutton() {
    window.open('https://twitter.com/share?url=' + this.url, '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    return false;
  }
  emaiil() {
    this.emailtext = !this.emailtext;
    this.smstext = false;
  }
  emailpost() {
    this.text = this.url;
    this.subject = "";
    this.CampaignService.sendEmail(this.email, this.text, this.subject, '')
      .then(res => this.emailposth(res));
  }
  emailposth(res: any) {
    if (res) {
      this.suceessmsg = true;
      this.smsucess = false;
    }
  }
  sms() {
    this.smstext = !this.smstext;
    this.emailtext = false;
  }
  smspost() {
    this.CampaignService.smsCampaignLink(this.url, 479,  this.user.displayName, '',this.mobileNumber)
      .then(res => this.smsposth(res));
  }
  smsposth(res: any) {
    if (res) {
      this.suceessmsg = false;
      this.smsucess = true;
    }
  }
  WhatsApp() {
    this.suceessmsg = false;
    this.emailtext = false;
    this.smsucess = false;
    this.smstext = false;
    window.open('whatsapp://send?text=' + this.url);
  }
  hasemail() {
    if (this.email) {
      return false;
    }
    return true;
  }
  hasSMS() {
    if (this.mobileNumber) {
      return false;
    }
    return true;
  }
}
