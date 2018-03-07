import { Component, EventEmitter, OnInit } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

import { UtilsService, User, UserService, LocationService, Product, ProductService, FileService, NewProduct, Variant } from 'benowservices';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {

  user: User;
  newProduct = new NewProduct(true, false, false, null, null, null, null,
    null, null, null, null,null,null, null, 'Clothing', null,
    null, null, null, null, null);
  variants = new Array<Variant>();
  numVariants: number = 0;
  uploadsURL: string;
  dashboard: string = '/dashboard';
  colorChip={
    /*data: [{
      tag: 'Red',
      image: '../../assets/shared/images/redCircle.png'
    }],*/
    placeholder: '+Color',
    secondaryPlaceholder: 'Done',
    autocompleteOptions: {
      data: {
        'Red': '../../assets/shared/images/redCircle.png',
        'Green': '../../assets/shared/images/green.png',
        'Blue': '../../assets/shared/images/blueCircle.png'
      },
      limit: Infinity,
      minLength: 1
    }
  };
  sizeChip={
    placeholder: '+Size',
    secondaryPlaceholder: '+Size',
    autocompleteOptions: {
      data: {
        'Small': null,'Medium': null,'Large': null,'S': null,'M': null,'L': null,'XL': null,'XXL': null,'XXXL': null,
        '5': null,'6': null,'7': null,'8': null,'9': null,'10': null,'11': null,'12': null,'13': null,'14': null,'15': null,
        '16': null,'17': null,'18': null,'19': null,'20': null,'21': null,'22': null,'23': null,'24': null,'25': null,
        '26': null,'27': null,'28': null,'29': null,'30': null,'31': null,'32': null,'33': null,'34': null,'35': null,
        '36': null,'37': null,'38': null,'39': null,'40': null,'41': null,'42': null,'43': null,'44': null,'45': null
      },
      limit: Infinity,
      minLength: 1
    }
  };
  uploaded: boolean = false;
  imageUrls: Array<string>;
  numImages: number = 0;
  variantDec = new EventEmitter<string|MaterializeAction>();
  fromDt: any;
  toDt: any;
  dateParams: any;
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

  constructor(private locationService: LocationService, private userService: UserService, private utilsService: UtilsService,
              private productService: ProductService, private fileService: FileService) { }

  ngOnInit() {
    let me = this;
    this.locationService.setLocation('addproduct');

    this.userService.getUser()
      .then(res => this.init(res));

    this.dateParams = [{
      format: 'dd-mm-yyyy', closeOnSelect: true, selectMonths: true, selectYears: 10, min: this.utilsService.getCurDateString(), monthsFull: this.monthsFull,
      monthsShort: this.monthsShort, weekdaysFull: this.weekdaysFull, weekdaysLetter: this.weekdaysShort, showWeekdaysFull: false, today: this.today,
      close: this.close, clear: this.clear, labelMonthNext: this.labelMonthNext, labelMonthPrev: this.labelMonthPrev,
      labelMonthSelect: this.labelMonthSelect, labelYearSelect: this.labelYearSelect, onClose: function () { me.dtClosed(); }
    }];
  }

  calculateDiscount(){
    if(this.newProduct.discount && this.newProduct.discount > 0 && this.newProduct.discount <= 100){
      this.newProduct.originalPrice = this.newProduct.price - (this.newProduct.price * (this.newProduct.discount/100));
    }
    else{
      this.newProduct.originalPrice = this.newProduct.price;
    }
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

  add(res: any){
    console.log(res.tag);
  }

  init(res: User){
    this.user = res;
    this.uploadsURL = this.utilsService.getUploadsURL();
  }

  selectProdType(type: string){
    this.newProduct.productType = type;
  }

  fileChange(e: any){
    this.uploaded = false;
    if (e.target && e.target.files) {
      if (e.target.files && e.target.files[0]) {
        this.utilsService.setStatus(false, false, '');
        if (e.target.files[0].size > 5000000) {
          window.scrollTo(0, 0);
          this.utilsService.setStatus(true, false, 'File is bigger than 1 MB!');//5 MB
        }
        else {
          this.fileService.upload(e.target.files[0], "15", "PORTABLE_PAYMENT", this.uploadedImage, this);
        }
        e.target.value = '';
      }
    }
  }

  uploadedImage(res: any, me: any) {
    if (res && res.success){
      me.imageUrls[me.numImages] = res.fileName;
      me.uploaded = true;
      me.numImages = me.numImages + 1;
    }
    else {
      window.scrollTo(0, 0);
      me.utilsService.setStatus(true, false, res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.');
    }
  }

  deleteImage(id: any){
    if(id && this.imageUrls && this.imageUrls.length > 0) {
      this.imageUrls = this.imageUrls.filter(i => i != id);
    }
  }

  updateVariants(){
    this.newProduct.hasVariants = true;
    this.addVariant();
  }

  addVariant(){
    let me = this;
    this.numVariants = this.numVariants + 1;
    let id: string = this.numVariants.toString();
    this.variants.push(new Variant(null, this.newProduct.price, this.newProduct.price, id, null, true, null));
    if(this.numVariants < 2){
      setTimeout(function(){ me.openVariant(me.numVariants); }, 300);
    }
    else{
      this.openVariant(this.numVariants);
    }
  }

  openVariant(id) {
    this.variantDec.emit({action:"collapsible",params:['open', id-1]});
  }

  closeFirst() {
    this.variantDec.emit({action:"collapsible",params:['close',0]});
  }

  deleteVariant(id: any){
    if(id && this.variants && this.variants.length > 0) {
      this.variants = this.variants.filter(i => i.id != id);
    }
  }

  added(res: any){
    console.log('Added Prod: ', res);
  }

  onSubmit(){
    console.log('Submitted!', this.variants);
    /*this.productService.addProductHB(this.user.merchantCode, this.newProduct)
      .then(res => this.added(res));*/
  }
}
