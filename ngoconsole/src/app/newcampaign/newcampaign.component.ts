import { Component, OnInit, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';

import { TranslateService } from 'ng2-translate';
import { MaterializeAction } from 'angular2-materialize';

import { FileService, UtilsService, User, UserService, Product, ProductService, SDKService, SDK } from 'benowservices';

import { SelectproductsComponent } from './../selectproducts/selectproducts.component';

@Component({
  selector: 'app-newcampaign',
  templateUrl: './newcampaign.component.html',
  styleUrls: ['./newcampaign.component.css']
})
export class NewcampaignComponent implements OnInit, AfterViewInit {
  amount: number;
  minpanamnt: number;
  campaignTarget: number;
  expDt: string;
  imgURL: string;
  uploadsURL: string;
  description: string;
  campaignName: string;
  mobileNumber: string;
  user: User;
  products: Array<Product>;
  dateParams: any;
  askpan: boolean = false;
  mndpan: boolean = false;
  askname: boolean = false;
  mndname: boolean = false;
  askemail: boolean = false;
  mndemail: boolean = false;
  uploading: boolean = false;
  askaddress: boolean = false;
  mndaddress: boolean = false;
  askresidence: boolean = false;
  allowMultiSelect: boolean = true;
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
  selected: any = { "key": "isSelected", "value": true };
  modalActions: any = new EventEmitter<string|MaterializeAction>();
  @ViewChild(SelectproductsComponent) spc: SelectproductsComponent;

  constructor(private translate: TranslateService, private fileService: FileService, private utilsService: UtilsService, 
    private userService: UserService, private productService: ProductService, private sdkService: SDKService) { }

  ngAfterViewInit() { }

  ngOnInit() {
    //TODO: Calendar localization.
    //TODO: Shift calendar strings and methods to utility service.
    //TODO: Focus coming back after close on date control.
    //TODO: Window.scrollto should be get rid of.
    //TODO: Notification modal not opening on small screen.
    this.userService.getUser()
      .then(res => this.user = res);
    this.utilsService.setStatus(false, false, '');
    this.uploadsURL = this.utilsService.getUploadsURL();      
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

  hasProducts(): boolean {
    if(this.products) {
      let selProds:Array<Product> = this.products.filter(p => p.isSelected);
      if(selProds && selProds.length > 0)
        return true;
    }

    return false;
  }

  hasMultiProducts(): boolean {
    if(this.products) {
      let selProds:Array<Product> = this.products.filter(p => p.isSelected);
      if(selProds && selProds.length > 1)
        return true;
    }

    return false;
  }

  uploadedImage(res: any, me: any) {
    me.uploading = false;
    if(res && res.success) {
      me.imgURL = res.fileName;
      me.utilsService.setStatus(false, true, 'Uploaded campaign image successfully');
    }
    else {
      me.utilsService.setStatus(true, false, res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.');
    }
  }

  fileChange(e: any) {
    if(!this.uploading && e.target && e.target.files) {
      if(e.target.files && e.target.files[0]) {
        this.utilsService.setStatus(false, false, '')      
        if(e.target.files[0].size > 1000000) {
          window.scrollTo(0, 0);
          this.utilsService.setStatus(true, false, 'File is bigger than 1 MB!')      
        }
        else {          
          this.uploading = true;
          this.fileService.upload(e.target.files[0], "15", "PORTABLE_PAYMENT", this.uploadedImage, this);
        }
      }
    }    
  }

  initializeSPC(ps: Array<Product>) {
    let me: any = this;
    me.spc.initialize(ps);
    if(ps && ps.length > 0)
      this.products = ps;
  }

  showProductsModal() {
    this.modalActions.emit({ action: "modal", params: ['open'] });
    if(!this.products)
      this.productService.getProducts(this.user.merchantCode)
        .then(res => this.initializeSPC(res));
    else
      this.initializeSPC(this.products);
  }

  invalidForm(): boolean {
    if(this.amount != null && this.amount != undefined && this.amount <= 0)
      return true;

    if(this.campaignTarget != null && this.campaignTarget != undefined && this.campaignTarget <= 0)
      return true;

    if(this.askpan && this.mndpan && (this.minpanamnt == null || this.minpanamnt == undefined || this.minpanamnt < 0))
      return true;

    return false;
  }

  dtClosed() {
  }

  createCampaign() {
    let selProducts: Array<Product>;
    if(this.products)
      selProducts = this.products.filter(p => p.isSelected);

    this.sdkService.savePaymentLinkDetails(new SDK(true, this.askaddress, true, this.mndpan, this.askpan, this.mndname, this.askname, this.askemail,
      this.mndemail, this.mndaddress, false, false, false, this.askresidence, false, false, this.allowMultiSelect, false, 2, 
      this.amount ? this.amount : null, this.user.language, 0, this.minpanamnt ? this.minpanamnt : null, 2, 
      this.campaignTarget ? this.campaignTarget : null, null, null, null, null, null, this.mobileNumber, this.campaignName, this.user.mccCode, 
      this.imgURL ? this.imgURL : null, null, null, this.user.id, this.expDt ? this.expDt : null, null, this.description ? this.description : null, 
      this.user.merchantCode, this.user.displayName, null, null, null, null, null, null, null, 
      selProducts && selProducts.length > 0 ? selProducts : null))
      .then(res => this.submitted(res));
  }

  submitted(res: any) {
    window.scrollTo(0, 0);
    if(res && res.success === true)
      this.utilsService.setStatus(false, true, 'Successfully sent payment link via SMS')
    else
      this.utilsService.setStatus(true, false, res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.')
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
