import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { Product, ProductService, User, UtilsService, FileService } from 'benowservices';

@Component({
  selector: 'addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {
  imgErrMsg: string;
  uploadsURL: string;
  uploading: boolean = false;
  newProd: Product = new Product(null, null, null, null, null, null, null, null, null, null);
  @Input('edit') edit: boolean;
  @Input('user') user: User;
  @Output()
  addedProd: EventEmitter<Product> = new EventEmitter();
  constructor(private productService: ProductService, private utilsService: UtilsService, private fileService: FileService) { 
    this.uploadsURL = utilsService.getUploadsURL();        
  }

  ngOnInit() {
  }

  hasImage(): boolean {
    if(this.newProd && this.newProd.imageURL && this.newProd.imageURL.trim() && this.newProd.imageURL.trim().length > 0)
      return true;

    return false;
  }

  canBeSaved(p: Product): boolean {
    if(this.newProd && this.newProd.id && p && p.id && this.newProd.name && this.newProd.name.trim() && this.newProd.name.trim().length > 0
      && this.newProd.price > 0) {
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
    if(this.newProd.name && this.newProd.price > 0) {
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
      this.newProd = new Product(null, null, null, null, null, null, null, null, null, null);
      this.addedProd.emit(p);
    }
    else
      this.imgErrMsg = this.utilsService.returnGenericError().errMsg;
  }

  fileChange(e: any) {
    if(!this.uploading && e.target && e.target.files) {
      if(e.target.files && e.target.files[0]) {
        this.imgErrMsg = null;
        this.utilsService.setStatus(false, false, '')      
        if(e.target.files[0].size > 1000000)
          this.imgErrMsg = 'File is bigger than 1 MB!';
        else {          
          this.uploading = true;
          this.fileService.upload(e.target.files[0], "15", "PORTABLE_PAYMENT", this.uploadedImage, this);
        }
      }
    }    
  }
}
