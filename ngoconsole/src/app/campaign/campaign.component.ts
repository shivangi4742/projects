import { Component, OnInit, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import { TranslateService } from 'ng2-translate';
import { MaterializeAction } from 'angular2-materialize';

import { FileService, UtilsService, User, UserService, Product, ProductService, CampaignService, SDKService, Status, HelpService } from 'benowservices';

import { SelectproductsComponent } from './../selectproducts/selectproducts.component';
import { Campaign } from "../../../../sharedservices/src/models/campaign.model";
import { CampaignList } from "../../../../sharedservices/src/models/campaignlist.model";
import { SDK } from "../../../../sharedservices/src/models/sdk.model";

@Component({
  selector: 'campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})
export class CampaignComponent implements OnInit, AfterViewInit {
  uploadsURL: string;
  sdk: SDK;
  user: User;
  helpMsg: any;
  dateParams: any;
  selProducts: Array<Product>;
  isMobile: boolean = false;
  uploading: boolean = false;
  bannerover: boolean = false;
  pg: number = 1;
  campExpand: boolean = false;
  isClone: boolean = false;
  today: string = 'Today';
  close: string = 'Close';
  clear: string = 'Clear';
  todayX: string = 'Today';
  closeX: string = 'Close';
  clearX: string = 'Clear';
  isInitial: boolean = true;
  active: number = 0;
  numPages: number  = 0;
  page: number = 1;
  fromDate: string =  this.utilsService.getLastYearDateString()+" 00:00:00";
  toDate: string = this.utilsService.getCurDateString()+" 23:59:59";
  sortColumn: string = null;
  campaignName: string = null;
  numCampaigns: number = 0;
  selectedCamp: string;
  labelMonthNext: string = 'Next month';
  labelMonthNextX: string = 'Next month';
  labelMonthPrev: string = 'Previous month';
  labelYearSelect: string = 'Select a year';
  labelMonthPrevX: string = 'Previous month';
  labelYearSelectX: string = 'Select a year';
  labelMonthSelect: string = 'Select a month';
  labelMonthSelectX: string = 'Select a month';
  showHelp: any = {};
  weekdaysShort: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekdaysShortX: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekdaysFull: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  weekdaysFullX: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthsShort: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthsShortX: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthsFull: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthsFullX: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  modalActions: any = new EventEmitter<string|MaterializeAction>();
  allCampaigns: Array<Campaign>;
  campaignList: Array<CampaignList>;
  @ViewChild(SelectproductsComponent) spc: SelectproductsComponent;

  constructor(private translate: TranslateService, private fileService: FileService, private utilsService: UtilsService,
    private userService: UserService, private productService: ProductService, private campaignService: CampaignService, private router: Router,
    private route: ActivatedRoute, private sdkService: SDKService, private helpService: HelpService) { }

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

  getStatus(): Status {
    return this.utilsService.getStatus();
  }

  initHelp(res: any) {
    this.helpMsg = res;
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

  hasCampaigns(){
    if(this.allCampaigns && this.allCampaigns.length > 0)
      return true;

    return false;
  }

  getAllCampaigns(res: any){
    this.numPages = res.numPages;
    this.numCampaigns = res.totalCamps;
    this.allCampaigns = res.allCampaigns;
  }

  updateAllCampaigns(){
    if(this.campaignName){
      this.page = 1;
      let tempCampName: string = this.campaignName.toUpperCase();
      this.campaignService.getCampaigns(null, null, null, null, tempCampName, "DESC", this.page)
        .then(res => this.getAllCampaigns(res));
    }
    else{
      this.campaignService.getCampaigns(this.user.merchantCode, this.fromDate, this.toDate, this.sortColumn, null, "DESC", this.page)
        .then(res => this.getAllCampaigns(res));
    }
  }

  sortCampaigns(columnId: string){
    if(columnId == "1")
      this.sortColumn = "campaignName";
    else if(columnId == "2")
      this.sortColumn = "fundraised";
    else if(columnId == "3")
      this.sortColumn = "creationDate";
    else
      this.sortColumn = null;

    this.campaignService.getCampaigns(this.user.merchantCode, this.fromDate, this.toDate, this.sortColumn, null, "DESC", this.page)
      .then(res => this.getAllCampaigns(res));
  }

  next() {
    let page = ++this.page;
    this.allCampaigns = null;
    this.numPages = 0;
    window.scrollTo(0, 0);
    if(this.campaignName){
      this.campaignService.getCampaigns(null, null, null, null, this.campaignName, "DESC", page)
        .then(res => this.getAllCampaigns(res));
    }
    else{
      this.campaignService.getCampaigns(this.user.merchantCode, this.fromDate, this.toDate, this.sortColumn, null, "DESC", page)
        .then(res => this.getAllCampaigns(res));
    }
  }

  previous() {
    let page = --this.page;
    this.allCampaigns = null;
    this.numPages = 0;
    window.scrollTo(0, 0);
    this.utilsService.setStatus(false, false, '');
    if(this.campaignName){
      this.campaignService.getCampaigns(null, null, null, null, this.campaignName, "DESC", page)
        .then(res => this.getAllCampaigns(res));
    }
    else{
      this.campaignService.getCampaigns(this.user.merchantCode, this.fromDate, this.toDate, this.sortColumn, null, "DESC", page)
        .then(res => this.getAllCampaigns(res));
    }
  }

  searchCampaigns(){
    document.getElementById("searchCamp")
      .addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          document.getElementById("search").click();
        }
      });
  }

  private initUser(res: User) {
    if(res) {
      this.user = res;
      this.uploadsURL = this.utilsService.getUploadsURL();
      this.isMobile = this.utilsService.isAnyMobile();

      let mtype: number = 2;
      if(this.utilsService.isHB(this.user.merchantCode, this.user.lob))
        mtype = 3;

      this.helpService.getHelpTexts(mtype)
        .then(hres => this.initHelp(hres));

      this.resetSdk();

      let page = this.route.snapshot.params['page'];
      if(page > 1)
        this.page = page;
    }
    else
      window.location.href = this.utilsService.getLogoutPageURL();
  }

  resetSdk(){
    this.sdk = null;
    //if(!this.isClone)
    this.selProducts = null;

    let mtype: number = 2;
    if(this.utilsService.isHB(this.user.merchantCode, this.user.lob))
      mtype = 3;

    this.sdk = new SDK(false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
      mtype, 0, this.user.language, 0, null, mtype, null, null, null, null, null, null, null, null, this.user.mccCode, null, null, null,
      this.user.id, null, null, null, this.user.merchantCode, this.user.displayName, null, null, null, null, null, null, null, null, null, null,
      null, null, null);
  }

  getDescLength(): string {
    if(this.sdk && this.sdk.description)
      return this.sdk.description.length.toString();

    return '0';
  }

  getTitleLength(): string {
    if(this.sdk && this.sdk.title)
      return this.sdk.title.length.toString();

    return '0';
  }

  uploadedImage(res: any, me: any) {
    me.uploading = false;
    if(res && res.success)
      me.sdk.imageURL = res.fileName;
    else {
      window.scrollTo(0, 0);
      me.utilsService.setStatus(true, false, res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.');
    }
  }

  fileChange(e: any) {
    if(!this.uploading && e.target && e.target.files) {
      if(e.target.files && e.target.files[0]) {
        this.utilsService.setStatus(false, false, '');
        if(e.target.files[0].size > 5000000) {
          window.scrollTo(0, 0);
          this.utilsService.setStatus(true, false, 'File is bigger than 1 MB!');//5 MB
        }
        else {
          this.uploading = true;
          this.bannerover = false;
          this.fileService.upload(e.target.files[0], "15", "PORTABLE_PAYMENT", this.uploadedImage, this);
        }

        e.target.value = '';
      }
    }
  }

  addProduct() {
    this.modalActions.emit({ action: "modal", params: ['open'] });
    this.spc.initialize();
  }

  goToDashboard() {
    window.location.href = this.utilsService.getOldDashboardURL();
  }

  updateCampaign(cres: any){
    this.sdk = cres;
  }

  campaignClicked(campId: any) {
    if(this.selectedCamp != campId){
      this.selectedCamp = campId;
      this.campExpand = false;
    }
    this.campExpand = !this.campExpand;
    this.sdkService.getPaymentLinkDetails(campId)
      .then(res => this.updateCampaign(res));

    this.productService.getProductsForCampaign(this.user.merchantCode, campId)
      .then(res => this.fillProds(res));
  }

  clone(){
    this.isClone = true;
    this.sdk.expiryDate = null;
    let createTab = document.getElementById('create');
    createTab.click();
  }

  fillProds(res: Array<Product>){
    this.selProducts = res;
  }

  invalidForm(): boolean {
    if(this.sdk.askpan && this.sdk.mndpan && (this.sdk.minpanamnt == null || this.sdk.minpanamnt == undefined || this.sdk.minpanamnt < 0))
      return true;

    if(this.sdk.campaignTarget && (this.sdk.campaignTarget < 1 || this.sdk.campaignTarget > 9999999.99))
      return true;

    if(this.sdk.mtype == 3 && (!this.selProducts || this.selProducts.length <= 0))
      return true;

    return false;
  }

  created(res: any) {
    if(res && res.paymentReqNumber) {
      this.sdk.id = res.paymentReqNumber;
      this.campaignService.setCampaign(this.sdk);
      if(this.sdk.mtype == 2)
        this.router.navigateByUrl('/sharecampaign/' + res.paymentReqNumber);
      else
        this.router.navigateByUrl('/shareestall/' + res.paymentReqNumber);
    }
    else {
      window.scrollTo(0, 0);
      if(this.utilsService.getUnregistered())
        this.utilsService.setStatus(true, false, 'You need to complete registration to be able to create an e-Stall');
      else
        this.utilsService.setStatus(true, false, res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.');
    }
  }

  create() {
    let campName: string = this.sdk.title.trim();
    if(campName.length > 0){
      this.sdk.products = this.selProducts;
      this.campaignService.saveCampaign(this.sdk)
        .then(res => this.created(res));
    }
    else{
      this.utilsService.setStatus(true, false, 'Please enter a valid Campaign Name.');
    }

  }

  resetStatus() {
    this.utilsService.setStatus(false, false, '');
  }

  setActiveTab(t: number) {
    if(!this.isClone)
      this.resetSdk();

    if(t==1){
      this.campaignService.getCampaigns(this.user.merchantCode, this.fromDate, this.toDate, this.sortColumn, this.campaignName, "DESC", this.page)
        .then(cres => this.getAllCampaigns(cres));
    }

    this.selectedCamp = '';
    if(this.active != t) {
      this.active = t;
      this.isInitial = false;
    }

    this.isClone = false;
  }

  get_help(key) {
    if(this.showHelp && this.showHelp[key])
      return this.showHelp[key];

    return '';
  }

  has_help(key) {
    if(this.helpMsg && this.helpMsg[key])
      return true;

    return false;
  }

  toggle_help(key) {
    if(this.showHelp && this.showHelp[key])
      this.showHelp[key] = '';
    else {
      this.showHelp = {};
      this.showHelp[key] = this.helpMsg[key];
    }
  }

  ngAfterViewInit() { }

  hasSelectedProducts(): boolean {
    if(this.spc) {
      let p: Array<Product> = this.spc.getSelectedProducts();
      if(p && p.length > 0)
        return true;
    }

    return false;
  }

  canBeClosed() {
    if(this.sdk.mtype == 3)
      return this.hasSelectedProducts();

    return true;
  }

  closeModal() {
    this.selProducts = this.spc.getSelectedProducts();
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }
}
