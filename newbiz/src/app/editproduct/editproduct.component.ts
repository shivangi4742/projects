import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
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
  isAmountLess: boolean = false;
  discountError: boolean = false;
  modalActions2: any = new EventEmitter<string|MaterializeAction>();
  cropperSettings: CropperSettings;
  data: any;
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
  isImageProcess: boolean = false;
  isError:boolean= false;
  fileerrormessage :string;
  subsucees: boolean = false;
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
              private productService: ProductService, private fileService: FileService) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 120;
    this.cropperSettings.height = 120;
    this.cropperSettings.croppedWidth = 120;
    this.cropperSettings.croppedHeight = 120;
    this.cropperSettings.canvasWidth = 120;
    this.cropperSettings.canvasHeight = 120;
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.preserveSize = true;
    this.cropperSettings.keepAspect = false;

    this.data = {};
  }

  ngOnInit() {
    let me = this;
    this.locationService.setLocation('editproduct');

    this.userService.getUser()
      .then(res => this.init(res));

    this.prodId = this.route.snapshot.params['id'];

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
          'Red': '../../assets/shared/images/Red.png', 'Brown': '../../assets/shared/images/Brown.png', 'Grey': '../../assets/shared/images/Grey.png',
          'Green': '../../assets/shared/images/green.png', 'Black': '../../assets/shared/images/Black.png', 'Purple': '../../assets/shared/images/Purple.png',
          'Blue': '../../assets/shared/images/Blue.png', 'Pink': '../../assets/shared/images/Pink.png', 'Gold': '../../assets/shared/images/Gold.png',
          'Silver': '../../assets/shared/images/Silver.png', 'Yellow': '../../assets/shared/images/Yellow.png', 'Gunmetal': '../../assets/shared/images/Gunmetal.png',
          'Maroon': '../../assets/shared/images/Maroon.png', 'White': null, 'Orange': '../../assets/shared/images/Orange.png',
          'Metallic': '../../assets/shared/images/Metallic.png', 'Beige': '../../assets/shared/images/Beige.png', 'Copper': '../../assets/shared/images/Copper.png',
          'Navy Blue': '../../assets/shared/images/Navy.png', 'Burgundy': '../../assets/shared/images/Burgundy.png', 'Olive': '../../assets/shared/images/Olive.png',
          'Steel': '../../assets/shared/images/Steel.png', 'Charcoal': '../../assets/shared/images/Charcoal.png', 'Bronze': '../../assets/shared/images/Bronze.png',
          'Teal': '../../assets/shared/images/Teal.png', 'Coral': '../../assets/shared/images/Coral.png', 'Peach': '../../assets/shared/images/Peach.png',
          'Magenta': '../../assets/shared/images/Magenta.png', 'Lavender': '../../assets/shared/images/Lavender.png', 'Turquoise': '../../assets/shared/images/Turquoise.png',
          'Taupe': '../../assets/shared/images/Taupe.png', 'Mauve': '../../assets/shared/images/Mauve.png', 'Khaki': '../../assets/shared/images/Khaki.png',
          'Rust': '../../assets/shared/images/Rust.png', 'Lime Green': '../../assets/shared/images/Lime.png', 'Coffee Brown': '../../assets/shared/images/Coffee.png'      },
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
          '36': null,'37': null,'38': null,'39': null,'40': null,'41': null,'42': null,'43': null,'44': null,'45': null, 'Onesize': null
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
    this.editProduct.color = res.tag;
  }

  clearProdColor(){
    this.editProduct.color = null;
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

    this.productService.getProductForEdit(this.prodId)
      .then(res => this.loadProduct(res));
  }

  setProdStock(){
    this.editProduct.isAvailable = !this.editProduct.isAvailable;
    console.log('here');
  }

  getSwitchProdText(check: boolean): string{
    if(check){
      return 'In Stock';
    }

    return 'Out of Stock';
  }

  loadProduct(res: NewProduct){
    this.editProduct = res;
    if(this.editProduct.hasVariants){
      this.variants = this.editProduct.variants;
    }
    if(this.editProduct.prodImgUrls.length > 0){
      this.imageUrls = this.editProduct.prodImgUrls;
    }
    if(this.editProduct.prodSizes.length >0){
      this.prodSizes = this.editProduct.prodSizes;
     // console.log(this.prodSizes,'sjdfjgsdjdhkkf');
    }
  }

 
  checkAmount(){
    if(this.editProduct.price < 10){
      this.isAmountLess = true;
    }
    else{
      this.isAmountLess = false;
    }
   
    if(this.editProduct.discountedPrice){
      if(this.editProduct.price <= this.editProduct.discountedPrice ){
        this.discountError = true;
      }
      else {
        this.discountError = false;
      }
    }
    else {
      this.discountError = false;
    }
  }

  checkVarAmount(id: any): boolean{
    for(let i:number = 0; i < this.variants.length; i++){
      if(id == this.variants[i].id){
        if(this.variants[i].price){
          if(this.variants[i].price < 10){
            return true;
          }
        }
      }
    }

    return false;
  }

  checkVarDiscount(id: any): boolean{
    for(let i:number = 0; i < this.variants.length; i++){
      if(id == this.variants[i].id){
        if(this.variants[i].discountedPrice){
          if(this.variants[i].discountedPrice < 10 || this.variants[i].price <= this.variants[i].discountedPrice){
            return true;
          }
        }
      }
    }

    return false;
  }

  checkForm(){
    if(this.isAmountLess){
      return true;
    }

    if(this.discountError){
      return true;
    }

    if(this.editProduct.productType == 'Lifestyle'){
      if(this.imageUrls.length < 1){
        return true;
      }
      if(this.editProduct.hasVariants){
        for(let i:number = 0; i < this.variants.length; i++){
          if(!this.variants[i].price && !this.variants[i].color){
            return true;
          }
          if(this.variants[i].price < 10){
            return true;
          }
          if(this.variants[i].discountedPrice){
            if(this.variants[i].discountedPrice < 10 || this.variants[i].price <= this.variants[i].discountedPrice){
              return true;
            }
          }
        }
      }
      if(!this.editProduct.color){
        return true;
      }
    }

    if(this.editProduct.productType == 'FoodAndBeverages'){
      if(this.imageUrls.length < 1){
        return true;
      }
      if(this.editProduct.hasVariants){
        for(let i:number = 0; i < this.variants.length; i++){
          if(!this.variants[i].price && !this.variants[i].variantCode){
            return true;
          }
          if(this.variants[i].price < 10){
            return true;
          }
          if(this.variants[i].discountedPrice){
            if(this.variants[i].discountedPrice < 10 || this.variants[i].price <= this.variants[i].discountedPrice){
              return true;
            }
          }
        }
      }
    }

    if(this.editProduct.productType == 'Event'){

    }

    if(this.editProduct.productType == 'Other'){

    }

    return false;
  }

  onSubmit() {
    this.editProduct.prodSizes = this.prodSizes;
    this.editProduct.prodImgUrls = this.imageUrls;
    this.editProduct.variants = this.variants;
    this.productService.editProductHB(this.user.merchantCode, this.editProduct)
      .then(res  => this.onsubmitpost(res));
  }
  onsubmitpost(res:any){
   console.log(res);
   if(res)
   {
     this.subsucees= true;
   }
  }

  isImageOptimizing(): boolean {
    if(this.isImageProcess)
      return true;

    return false;
  }

  imgOptimize(file: File) {
    var image:any = new Image();
    var myReader: FileReader = new FileReader();
    let me = this;

    myReader.onloadend = function (loadEvent:any) {
      image.src = loadEvent.target.result;
      me.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
  }

  closeImgOpti(){
    this.isImageProcess = false;
    this.modalActions2.emit({ action: "modal", params: ['close'] });
  }

  saveImage() {
    if (this.data.image) {
      let a = (this.data.image).split(/,(.+)/)[1];
      var blob = this.utilsService.b64toBlob(a,'image/png','');
      var file = new File([blob], 'Test.png', {type: 'image/png', lastModified: Date.now()});
      this.uploading = true;

      this.fileService.upload(file, "15", "PORTABLE_PAYMENT", this.uploadedImage, this);
    }
    else{
      this.utilsService.setStatus(true, false, 'Please select an image!');
    }
    this.isImageProcess = false;
    this.modalActions2.emit({ action: "modal", params: ['close'] });
  }

  fileChange(e: any){
    if (e.target && e.target.files) {
      if (e.target.files && e.target.files[0]) {
        this.isImageProcess = true;
        this.utilsService.setStatus(false, false, '');
          this.imgOptimize(e.target.files[0]);
          this.modalActions2.emit({ action: "modal", params: ['open'] });
      }
      e.target.value = '';
    }
  }

  uploadedImage(res: any, me: any) {
    if (res && res.success){
      me.imageUrls.push(new ProductImage(null, res.fileName));
      me.uploading = false;
    }
    else {
      window.scrollTo(0, 0);
      me.utilsService.setStatus(true, false, res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.');
    }
  }

  deleteImage(id: any){
    if(id && this.imageUrls && this.imageUrls.length > 0) {
      this.imageUrls = this.imageUrls.filter(i => i.prodImgUrl != id);
    }
  }

  updateVariants(){
    this.editProduct.hasVariants = true;
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
      this.editProduct.hasVariants = false;
    }
  }


}
