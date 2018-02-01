import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from 'ng2-translate';

import { UtilsService, User, UserService, SDKService, Status } from 'benowservices';


@Component({
  selector: 'app-createpaymentlink',
  templateUrl: './createpaymentlink.component.html',
  styleUrls: ['./createpaymentlink.component.css']
})
export class CreatepaymentlinkComponent implements OnInit {

  dateParams: any;
  user: User;
  dashboard: string = "/dashboard";
  sampleDate: any;
  purpose: string;
  amount: number;
  invoiceNum: string;
  detailsExpanded: boolean = false;
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
              private userService: UserService, private router: Router,
              private route: ActivatedRoute, private sdkService: SDKService) { }

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
    this.userService.getUser()
      .then(res => this.user = res);
    let me = this;
    /*this.translate.onLangChange.subscribe((event: any) => {
      this.translate.getTranslation(this.translate.currentLang)
        .subscribe(res => me.translateCalStrings(res, true));
    });
    this.translate.getTranslation(this.translate.currentLang)
      .subscribe(res => me.translateCalStrings(res, false));
    */

    this.dateParams = [{
      format: 'dd-mm-yyyy', closeOnSelect: true, selectMonths: true, selectYears: 2, min: this.utilsService.getNextDateString(), monthsFull: this.monthsFull,
      monthsShort: this.monthsShort, weekdaysFull: this.weekdaysFull, weekdaysLetter: this.weekdaysShort, showWeekdaysFull: false, today: this.today,
      close: this.close, clear: this.clear, labelMonthNext: this.labelMonthNext, labelMonthPrev: this.labelMonthPrev,
      labelMonthSelect: this.labelMonthSelect, labelYearSelect: this.labelYearSelect, onClose: function () { me.dtClosed(); }
    }];
  }

  getStatus(): Status {
    return this.utilsService.getStatus();
  }

  arrowChange(){
    this.detailsExpanded = !this.detailsExpanded;
  }

  isCreated(res: any){
    if(res){
      console.log('Responsyo', res);
      this.router.navigateByUrl('/successpaylink/'+res.paymentReqNumber);
    }
    else{
      alert('Error in creating Payment Link!');
    }
  }

  onSubmit(){
    this.sdkService.createPaymentLink(this.user.merchantCode, this.purpose, this.amount, this.invoiceNum, this.sampleDate)
      .then(res => this.isCreated(res));
  }

  validateForm(): boolean {
    if(this.amount && this.purpose){
      if(this.amount > 9)
        return true;
    }

    return false;
  }



}
