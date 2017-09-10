import { Component, OnInit, EventEmitter } from '@angular/core';

import { TranslateService } from 'ng2-translate';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'app-newcampaign',
  templateUrl: './newcampaign.component.html',
  styleUrls: ['./newcampaign.component.css']
})
export class NewcampaignComponent implements OnInit {
  expDt: string;
  dateParams: any;
  askpan: boolean = false;
  mndpan: boolean = false;
  askname: boolean = false;
  mndname: boolean = false;
  askemail: boolean = false;
  mndemail: boolean = false;
  askaddress: boolean = false;
  mndaddress: boolean = false;
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

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    //TODO: Calendar localization.
    //TODO: Focus coming back after close on date control.
    //TODO: Max length of description to be checked by server side team.
    let me = this;
    this.translate.onLangChange.subscribe((event: any) => {
        this.translate.getTranslation(this.translate.currentLang)
        .subscribe(res => me.translateCalStrings(res, true));
    });
    this.translate.getTranslation(this.translate.currentLang)
        .subscribe(res => me.translateCalStrings(res, false));

    this.dateParams = [{format: 'dd-mm-yyyy', closeOnSelect: true, selectMonths: true, selectYears: 2, min: new Date(), monthsFull: this.monthsFull,
      monthsShort: this.monthsShort, weekdaysFull: this.weekdaysFull, weekdaysLetter: this.weekdaysShort, showWeekdaysFull: false, today: this.today,
      close: this.close, clear: this.clear, labelMonthNext: this.labelMonthNext, labelMonthPrev: this.labelMonthPrev, 
      labelMonthSelect: this.labelMonthSelect, labelYearSelect: this.labelYearSelect, onClose: function () { me.dtClosed(); }}];
  }

  dtClosed() {
    console.log('done', this.expDt);
  }

  createCampaign() {

  }

  translateCalStrings(res: any, langCh: boolean) {
    this.today = res[this.todayX];
    this.close = res[this.closeX];
    this.clear = res[this.clearX];
    this.labelMonthNext = res[this.labelMonthNextX];
    this.labelMonthPrev = res[this.labelMonthPrevX];
    this.labelYearSelect = res[this.labelYearSelectX];
    this.labelMonthSelect = res[this.labelMonthSelectX];
    let me = this;
    this.monthsFull = new Array<string>();
    this.monthsFullX.forEach(function(m) {me.monthsFull.push(res[m])});
    this.monthsShort = new Array<string>();
    this.monthsShortX.forEach(function(m) {me.monthsShort.push(res[m])});
    this.weekdaysFull = new Array<string>();
    this.weekdaysFullX.forEach(function(w) {me.weekdaysFull.push(res[w])});
    this.weekdaysShort = new Array<string>();
    this.weekdaysShortX.forEach(function(w) {me.weekdaysShort.push(res[w])});
  }
}
