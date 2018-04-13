import {Component, EventEmitter, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UtilsService, User, UserService, LocationService, NewProduct,Businesspro, ProductService, NewVariant, NewSize, Product, CampaignService } from 'benowservices';
import { MaterializeAction } from "angular2-materialize";

@Component({
  selector: 'app-productcatalog',
  templateUrl: './productcatalog.component.html',
  styleUrls: ['./productcatalog.component.css']
})
export class ProductcatalogComponent implements OnInit {
  businesspro:Businesspro;
  storeURL:string;
  smsucess:boolean = false;
  emailtext:boolean = false;
  subject:string;
  email:string;
  mobileNumber:string;
  smstext:boolean = false;
  user: User;
  dashboard: string = '/dashboard';
  uploadsURL: string;
  searchText: string;
  products: Array<NewProduct>;
  page: number = 1;
  numPages: number = 0;
  processing: boolean = false;
  deleting: boolean = false;
  inStock: boolean = false;
  modalActions: any = new EventEmitter<string|MaterializeAction>();
  fromDt: any;
  toDt: any;
  url:string;
  isCopied1: boolean = false;
  dateParams: any;
  prodId:string;
  text:string;
  suceessmsg:boolean = false;
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
  sharemodalActions: any = new EventEmitter<string|MaterializeAction>();
  storeurl:string;
  streurl:string;

  constructor(private router: Router,private campaignservice:CampaignService, private locationService: LocationService, private userService: UserService, private utilsService: UtilsService,
              private productService: ProductService) {
    this.uploadsURL = utilsService.getUploadsURL();
  }

  ngOnInit() {
    let me = this;
    this.locationService.setLocation('catalogue');

    this.userService.getUser()
      .then(res => this.init(res));

    this.dateParams = [{
      format: 'dd-mm-yyyy', closeOnSelect: true, selectMonths: true, selectYears: 10, min: this.utilsService.getCurDateString(), monthsFull: this.monthsFull,
      monthsShort: this.monthsShort, weekdaysFull: this.weekdaysFull, weekdaysLetter: this.weekdaysShort, showWeekdaysFull: false, today: this.today,
      close: this.close, clear: this.clear, labelMonthNext: this.labelMonthNext, labelMonthPrev: this.labelMonthPrev,
      labelMonthSelect: this.labelMonthSelect, labelYearSelect: this.labelYearSelect, onClose: function () { me.dtClosed(); }
    }];
  }

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

  init(res: User){
    this.user = res;
    this.userService.checkMerchant(this.user.mobileNumber,'b')
    .then(bres=>this.initshare(bres));

    this.productService.getProducts(this.user.merchantCode, this.page)
      .then(pres => this.updateProds(pres));
  }
  initshare(res:any){
    
    this.businesspro = res;
    this.storeurl= "https://pay-"+ this.businesspro.storeUrl + ".benow.in";
    this.streurl= this.businesspro.storeUrl + ".benow.in";
    this.url= "https://"+ this.businesspro.storeUrl + ".benow.in";
   
  }


  updateProds(res: any){
    this.numPages = res.numPages;
    this.products = res.products;
//     console.log(this.products,'this.products');
    this.processing = false;
    
  
  }

  next() {
    this.products = null;
    this.numPages = 0;
    this.processing = true;
    window.scrollTo(0, 0);
    this.productService.getProducts(this.user.merchantCode, (++this.page))
      .then(pres => this.updateProds(pres));
  }

  previous() {
    this.products = null;
    this.numPages = 0;
    this.processing = true;
    window.scrollTo(0, 0);
    this.productService.getProducts(this.user.merchantCode, (--this.page))
      .then(pres => this.updateProds(pres));
  }

  hasProducts(): boolean{
    if(this.products && this.products.length > 0)
      return true;

    return false;
  }

  deleted(res: Boolean) {
    if(res == true){
      this.productService.getProducts(this.user.merchantCode, this.page)
        .then(pres => this.updateProds(pres));
    }
    else
      this.deleting = false;
  }

  delete(id: any) {
    this.deleting = true;
    this.productService.deleteProduct(id)
      .then(res => this.deleted(res));
  }

  edit(id: any){
    this.router.navigateByUrl('/editproduct/'+id);
  }
  
  twitterbutton() {
    this.url= "https://"+ this.businesspro.storeUrl + ".benow.in";
    window.open('https://twitter.com/share?url=' + this.url,'', 
    'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    return false;
  }

  fbClick() {
    this.url= "https://"+ this.businesspro.storeUrl + ".benow.in";
    window.open('https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&u=' + 
    this.url + '&display=popup&ref=plugin&src=share_button', '',
     'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    return false;
  }
  share(id:any){
    this.prodId= id;
    this.sharemodalActions.emit({ action: "modal", params: ['open'] });
    this.url= "https://"+ this.businesspro.storeUrl + ".benow.in";
}
shareclose(){
  this.sharemodalActions.emit({ action: "modal", params: ['close'] });
}
createprod(){
  this.router.navigateByUrl('/addproduct');
}
emaiil(){
  this.emailtext = !this.emailtext;
  this.smstext = false;
}
emailpost(){
  this.text=this.url;
  this.subject="";
  this.campaignservice.sendEmail(this.email, this.text, this.subject,'')
    .then(res => this.emailposth(res));
}
emailposth(res:any){
  if(res){
    this.suceessmsg= true;
  }
}
sms() {
this.smstext = !this.smstext;
this.emailtext = false;
}
smspost(){
  this.campaignservice.smsCampaignLink(this.url, 479, '', this.user.displayName, this.mobileNumber)
   .then(res => this.smsposth(res));
}
smsposth(res:any){
  if(res){
    this.smsucess= true;
  }
}
WhatsApp(){
  window.open('whatsapp://send?text=' + this.url);
}

}
