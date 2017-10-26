import { Component, OnInit, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from 'ng2-translate';
import { MaterializeAction } from 'angular2-materialize';

import { FileService, UtilsService, User, UserService, Product, ProductService, CampaignService, SDK } from 'benowservices';

import { SelectproductsComponent } from './../selectproducts/selectproducts.component';

@Component({
  selector: 'campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})
export class CampaignComponent implements OnInit, AfterViewInit {
  imgErrMsg: string;
  uploadsURL: string;
  sdk: SDK;
  user: User;
  dateParams: any;
  allProducts: Array<Product>;
  isMobile: boolean = false;
  uploading: boolean = false;
  bannerover: boolean = false;
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
    private userService: UserService, private productService: ProductService, private campaignService: CampaignService, private router: Router) { }

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
    this.monthsFullX.forEach(function(m) {me.monthsFull.push(res[m])});
    this.monthsShort = new Array<string>();
    this.monthsShortX.forEach(function(m) {me.monthsShort.push(res[m])});
    this.weekdaysFull = new Array<string>();
    this.weekdaysFullX.forEach(function(w) {me.weekdaysFull.push(res[w])});
    this.weekdaysShort = new Array<string>();
    this.weekdaysShortX.forEach(function(w) {me.weekdaysShort.push(res[w])});
  }

  private dtClosed() {
  }

  ngOnInit() {
    this.userService.getUser()
      .then(res => this.initUser(res));
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

  private initUser(res: User) {
    if(res) {
      this.user = res;
      this.uploadsURL = this.utilsService.getUploadsURL();      
      this.isMobile = this.utilsService.isAnyMobile();
      let mtype: number = 2;
      if(this.utilsService.isHB(this.user.merchantCode))
        mtype = 3;

      this.sdk = new SDK(false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        mtype, 0, this.user.language, 0, null, mtype, null, null, null, null, null, null, null, null, this.user.mccCode, null, null, null, 
        this.user.id, null, null, null, this.user.merchantCode, this.user.displayName, null, null, null, null, null, null, null, null, null, null, 
        null, null, null);        
    }
    else
      window.location.href = this.utilsService.getLogoutPageURL();      
  }

  uploadedImage(res: any, me: any) {
    me.uploading = false;
    if(res && res.success)
      me.sdk.imageURL = res.fileName;
    else
      me.imgErrMsg = res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.';
  }

  fileChange(e: any) {
    if(!this.uploading && e.target && e.target.files) {
      if(e.target.files && e.target.files[0]) {
        this.imgErrMsg = null;
        if(e.target.files[0].size > 2000000)
          this.imgErrMsg = 'File is bigger than 2 MB!';
        else {          
          this.uploading = true;
          this.bannerover = false;
          this.fileService.upload(e.target.files[0], "15", "PORTABLE_PAYMENT", this.uploadedImage, this);
        }
      }
    }    
  }

  addProduct() {
    this.modalActions.emit({ action: "modal", params: ['open'] });
    if(!this.allProducts)
      this.productService.getProducts(this.user.merchantCode)
        .then(res => this.initializeSPC(res));
    else
      this.initializeSPC(this.allProducts);    
  }

  initializeSPC(ps: Array<Product>) {
    let me: any = this;
    me.spc.initialize(ps);
    if(ps && ps.length > 0)
      this.allProducts = ps;
  }

  goToDashboard() {
    window.location.href = this.utilsService.getOldDashboardURL();
  }

  invalidForm(): boolean {
    if(this.sdk.askpan && this.sdk.mndpan && (this.sdk.minpanamnt == null || this.sdk.minpanamnt == undefined || this.sdk.minpanamnt < 0))
      return true;

    return false;
  }

  created(res: any) {
    if(res && res.paymentReqNumber) {
      this.sdk.id = res.paymentReqNumber;
      this.campaignService.setCampaign(this.sdk);
      this.router.navigateByUrl('/sharecampaign/' + res.paymentReqNumber);
    }
    else {
      //TODO: Error handling
    }      
  }

  create() {
    if(this.allProducts)
      this.sdk.products = this.allProducts.filter(p => p.isSelected);

    this.campaignService.saveCampaign(this.sdk)
      .then(res => this.created(res));    
  }

  ngAfterViewInit() { }
  
  closeModal() {
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }
}
