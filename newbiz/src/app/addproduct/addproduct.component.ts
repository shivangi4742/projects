import { Component, EventEmitter, OnInit } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { Router, ActivatedRoute } from "@angular/router";

import { UtilsService, User, UserService, LocationService, Product, ProductService, FileService, NewProduct, NewVariant,
  ProductImage, NewSize } from 'benowservices';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {

  user: User;
  newProduct = new NewProduct(true, false, false, null, null, null, null,
    null, null, null, null,null,true, 'Lifestyle', null,
    null, null, null, null, null);
  variants = new Array<NewVariant>();
  prodSizes = new Array<NewSize>();
  variantSizes = new Array<NewSize>();
  numVariants: number = 0;
  numProdSizes: number = 0;
  numVariantSizes: number = 0;
  uploadsURL: string;
  dashboard: string = '/dashboard';
  colorChip;
  sizeChip;
  uploading: boolean = false;
  imageUrls = new Array<ProductImage>();
  numImages: number = 0;
  variantDec = new EventEmitter<string|MaterializeAction>();
  modalActions: any = new EventEmitter<string|MaterializeAction>();
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

  constructor(private router: Router, private locationService: LocationService, private userService: UserService, private utilsService: UtilsService,
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

    this.colorChip={
      /*data: [{
        tag: 'Red',
        image: '../../assets/shared/images/redCircle.png'
      }],*/
      placeholder: '+Color',
      secondaryPlaceholder: 'Done',
      autocompleteOptions: {
        data: {
          'Red': '../../assets/shared/images/redCircle.png', 'Brown': '../../assets/shared/images/redCircle.png', 'Grey': '../../assets/shared/images/redCircle.png',
          'Green': '../../assets/shared/images/green.png', 'Black': '../../assets/shared/images/redCircle.png', 'Purple': '../../assets/shared/images/redCircle.png',
          'Blue': '../../assets/shared/images/blueCircle.png', 'Pink': '../../assets/shared/images/redCircle.png', 'Gold': '../../assets/shared/images/redCircle.png',
          'Silver': '../../assets/shared/images/blueCircle.png', 'Yellow': '../../assets/shared/images/redCircle.png', 'Gunmetal': '../../assets/shared/images/redCircle.png',
          'Maroon': '../../assets/shared/images/blueCircle.png', 'White': '../../assets/shared/images/redCircle.png', 'Orange': '../../assets/shared/images/redCircle.png',
          'Metallic': '../../assets/shared/images/blueCircle.png', 'Beige': '../../assets/shared/images/redCircle.png', 'Copper': '../../assets/shared/images/redCircle.png',
          'Navy Blue': '../../assets/shared/images/blueCircle.png', 'Burgundy': '../../assets/shared/images/redCircle.png', 'Olive': '../../assets/shared/images/redCircle.png',
          'Steel': '../../assets/shared/images/blueCircle.png', 'Charcoal': '../../assets/shared/images/redCircle.png', 'Bronze': '../../assets/shared/images/redCircle.png',
          'Teal': '../../assets/shared/images/blueCircle.png', 'Coral': '../../assets/shared/images/redCircle.png', 'Peach': '../../assets/shared/images/redCircle.png',
          'Magenta': '../../assets/shared/images/blueCircle.png', 'Lavender': '../../assets/shared/images/redCircle.png', 'Turquoise': '../../assets/shared/images/redCircle.png',
          'Taupe': '../../assets/shared/images/blueCircle.png', 'Mauve': '../../assets/shared/images/redCircle.png', 'Khaki': '../../assets/shared/images/redCircle.png',
          'Rust': '../../assets/shared/images/blueCircle.png', 'Lime Green': '../../assets/shared/images/redCircle.png', 'Coffee Brown': '../../assets/shared/images/redCircle.png'      },
        limit: Infinity,
        minLength: 1
      }
    };

    this.sizeChip={
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

  addProdColor(res: any){
    this.newProduct.color = res.tag;
  }

  clearProdColor(){
    this.newProduct.color = null;
  }

  addProdSize(res: any){
    this.prodSizes.push(new NewSize(null, res.tag));
  }

  deleteProdSize(res: any){
    if(res.tag && this.prodSizes && this.prodSizes.length > 0){
      this.prodSizes = this.prodSizes.filter(i => i.prodSize != res.tag);
    }
  }

  addVarColor(id: any, res: any){
    if(this.variants && this.variants.length > 0){
      for(let i: number = 0; i < this.variants.length; i++){
        if(this.variants[i].id == id){
          this.variants[i].color = res.tag;
        }
      }
    }
  }

  clearVarColor(id: any){
    if(this.variants && this.variants.length > 0){
      for(let i: number = 0; i < this.variants.length; i++){
        if(this.variants[i].id == id){
          this.variants[i].color = null;
        }
      }
    }
  }

  addVarSize(id: any, res: any){
    if(this.variants && this.variants.length > 0){
      for(let i: number = 0; i < this.variants.length; i++){
        if(this.variants[i].id == id){
          if(this.variants[i].listProductSizes){
            this.variants[i].listProductSizes.push(new NewSize(null, res.tag));
          }
        }
      }
    }
  }

  deleteVarSize(id: any, res: any){
    if(this.variants && this.variants.length > 0){
      for(let i: number = 0; i < this.variants.length; i++){
        if(this.variants[i].id == id){
          if(res.tag && this.variants[i].listProductSizes && this.variants[i].listProductSizes.length > 0){
            this.variants[i].listProductSizes = this.variants[i].listProductSizes.filter(i => i.prodSize != res.tag);
          }
        }
      }
    }
  }

  init(res: User){
    this.user = res;
    this.uploadsURL = this.utilsService.getUploadsURL();
  }

  selectProdType(type: string){
    this.imageUrls = [];
    this.variants = [];
    this.prodSizes = [];
    this.newProduct = new NewProduct(true, false, false, null, null, null, null,
      null, null, null, null,null, true, null, null,
      null, null, null, null, null);
    this.newProduct.productType = type;
  }

  fileChange(e: any){
    this.uploading = true;
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
      me.imageUrls.push(new ProductImage(null, res.fileName));
      me.numImages = me.numImages + 1;
      me.uploading = false;
    }
    else {
      window.scrollTo(0, 0);
      me.utilsService.setStatus(true, false, res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.');
    }
    console.log(me.imageUrls);
  }

  deleteImage(id: any){
    console.log('hello');
    if(id && this.imageUrls && this.imageUrls.length > 0) {
      this.imageUrls = this.imageUrls.filter(i => i.prodImgUrl != id);
      this.numImages = this.numImages - 1;
    }
  }

  displayInfo(a: any){
    console.log('Image: ', a);
  }

  updateVariants(){
    this.newProduct.hasVariants = true;
    this.addVariant();
  }

  addVariant(){
    let me = this;
    this.numVariants = this.numVariants + 1;
    let id: string = this.numVariants.toString();
    this.variants.push(new NewVariant(null, null, id, null, true, null, null ,new Array<NewSize>()));
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

  deleteVariant(id: any){
    if(id && this.variants && this.variants.length > 0) {
      this.variants = this.variants.filter(i => i.id != id);
      this.numVariants = this.numVariants - 1;
    }
    if(this.numVariants == 0){
      this.newProduct.hasVariants = false;
    }
  }

  checkForm(){
    if(this.newProduct.productType == 'Lifestyle'){
      if(this.newProduct.hasVariants){
        for(let i:number = 0; i < this.variants.length; i++){
          if(!this.variants[i].price && !this.variants[i].color){
            return true;
          }
        }
        if(!this.newProduct.color){
          return true;
        }
      }
    }

    if(this.newProduct.productType == 'FoodAndBeverages'){
      if(this.newProduct.hasVariants){
        for(let i:number = 0; i < this.variants.length; i++){
          if(!this.variants[i].price && !this.variants[i].variantCode){
            return true;
          }
        }
      }
    }

    if(this.newProduct.productType == 'Event'){
    }

    if(this.newProduct.productType == 'Other'){

    }

    return false;
  }

  added(res: any){
    console.log('Added Prod: ', res);
  }

  done(){
    this.modalActions.emit({ action: "modal", params: ['close'] });
    this.router.navigateByUrl('/addproduct');
  }

  onSubmit(){
    this.newProduct.prodSizes = this.prodSizes;
    this.newProduct.prodImgUrls = this.imageUrls;
    this.newProduct.variants = this.variants;
    console.log('Submitted!', this.newProduct);
    this.productService.addProductHB(this.user.merchantCode, this.newProduct)
      .then(res => this.added(res));
    this.modalActions.emit({ action: "modal", params: ['open'] });
  }
}
