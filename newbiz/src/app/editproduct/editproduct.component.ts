import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MaterializeAction } from 'angular2-materialize';

import { UtilsService, User, UserService, LocationService, Product, ProductService, FileService, NewProduct, NewVariant,
  ProductImage, NewSize } from 'benowservices';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.css']
})
export class EditproductComponent implements OnInit {

  prodId: any;
  editProduct: NewProduct;
  variants = new Array<NewVariant>();
  prodSizes = new Array<NewSize>();
  variantSizes = new Array<NewSize>();
  numVariants: number = 0;
  numProdSizes: number = 0;
  numVariantSizes: number = 0;
  colorChip;
  sizeChip;
  uploading: boolean = false;
  imageUrls = new Array<ProductImage>();
  user: User;
  uploadsURL: string;
  catalogue: string = '/catalogue';
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

  constructor(private locationService: LocationService, private route: ActivatedRoute, private userService: UserService, private utilsService: UtilsService,
              private productService: ProductService, private fileService: FileService) { }

  ngOnInit() {
    let me = this;
    this.userService.getUser()
      .then(res => this.init(res));

    this.prodId = this.route.snapshot.params['id'];

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
    this.uploadsURL = this.utilsService.getUploadsURL();

    this.productService.getProductForEdit(this.prodId)
      .then(res => this.loadProduct(res));
  }

  loadProduct(res: NewProduct){
    this.editProduct = res;
    if(this.editProduct.hasVariants){
      this.variants = this.editProduct.variants;
    }
    if(this.editProduct.prodImgUrls.length > 0){
      this.imageUrls = this.editProduct.prodImgUrls;
    }
    if(this.editProduct.prodSizes){
      this.prodSizes = this.editProduct.prodSizes;
    }
  }

}
