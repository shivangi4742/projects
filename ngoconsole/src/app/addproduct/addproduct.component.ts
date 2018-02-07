import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

import { Product, ProductService, User, UtilsService, FileService } from 'benowservices';
import { MaterializeAction } from "angular2-materialize";

@Component({
  selector: 'addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {
  imgErrMsg: string;
  uploadsURL: string;
  uploading: boolean = false;
  mtype: number = 3;
  newProd: Product = new Product(null, null, null, null, null, null, null, null, null, null, null, null);
  @Input('edit') edit: boolean;
  @Input('user') user: User;
  @Output()
  addedProd: EventEmitter<Product> = new EventEmitter();
  cropperSettings: CropperSettings;
  data: any;
  isImageProcess: boolean = false;
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  constructor(private productService: ProductService, private utilsService: UtilsService, private fileService: FileService) {
    this.uploadsURL = utilsService.getUploadsURL();
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
    if(this.utilsService.isNGO(this.user.mccCode))
      this.mtype = 2;
  }

  hasImage(): boolean {
    if(this.newProd && this.newProd.imageURL && this.newProd.imageURL.trim() && this.newProd.imageURL.trim().length > 0)
      return true;

    return false;
  }

  isImageOptimizing(): boolean {
    if(this.isImageProcess)
      return true;

    return false;
  }

  canBeSaved(p: Product): boolean {
    if(this.newProd && this.newProd.id && p && p.id && this.newProd.name && this.newProd.name.trim() && this.newProd.name.trim().length > 0
      && (this.newProd.price >= 1 && this.mtype != 3 || this.mtype == 3 && this.newProd.price >= 10)) {
      if(p.name != this.newProd.name)
        return true;

      if(p.price != this.newProd.price)
        return true;

      if(p.imageURL && !this.newProd.imageURL)
        return true;

      if(!p.imageURL && this.newProd.imageURL)
        return true;

      if(p.imageURL && this.newProd.imageURL)
        if(p.imageURL != this.newProd.imageURL)
          return true;

      if(p.uom && !this.newProd.uom)
        return true;

      if(!p.uom && this.newProd.uom)
        return true;

      if(p.uom && this.newProd.uom)
        if(p.uom != this.newProd.uom)
          return true;

      if(p.description && !this.newProd.description)
        return true;

      if(!p.description && this.newProd.description)
        return true;

      if(p.description && this.newProd.description)
        if(p.description != this.newProd.description)
          return true;
    }

    return false;
  }

  setProduct(p: Product) {
    if(p && p.id) {
      this.newProd.id = p.id;
      this.newProd.uom = p.uom;
      this.newProd.name = p.name;
      this.newProd.price = p.price;
      this.newProd.imageURL = p.imageURL;
      this.newProd.description = p.description;
    }
  }

  getEditedProduct(): Product {
    return this.newProd;
  }

  addProduct() {
    if(this.newProd.name && ((this.newProd.price >= 10 && this.mtype == 3) || (this.newProd.price >= 1 && this.mtype != 3))) {
      this.productService.addProduct(this.user.merchantCode, this.newProd)
        .then(res => this.addedProduct(res));
    }
  }

  uploadedImage(res: any, me: any) {
    me.uploading = false;
    if(res && res.success)
      me.newProd.imageURL = res.fileName;
    else
      me.imgErrMsg = res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.';
  }

  private addedProduct(p: Product) {
    if(p && p.price > 0) {
      this.newProd = new Product(null, null, null, null, null, null, null, null, null, null, null, null);
      this.addedProd.emit(p);
    }
    else {
      if(this.utilsService.getUnregistered())
        this.imgErrMsg = 'You need to complete registration to be able to add products to catalog';
      else
        this.imgErrMsg = this.utilsService.returnGenericError().errMsg;
    }
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
  }

  fileChange(e: any) {
    if(!this.uploading && e.target && e.target.files) {
      if(e.target.files && e.target.files[0]) {
        this.isImageProcess = true;
        this.imgErrMsg = null;
        this.utilsService.setStatus(false, false, '')
        if(e.target.files[0].size > 5000000)
          this.imgErrMsg = 'File is bigger than 1 MB!';//5 MB
        else {
          this.imgOptimize(e.target.files[0]);
        }
        e.target.value = '';
      }
    }
  }
}
