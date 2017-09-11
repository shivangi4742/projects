import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import { User, UtilsService, Product, FileService, ProductService } from 'benowservices';

@Component({
  selector: 'selectproducts',
  templateUrl: './selectproducts.component.html',
  styleUrls: ['./selectproducts.component.css']
})
export class SelectproductsComponent implements OnInit {
  imgErrMsg: string;
  uploadsURL: string;
  products: Array<Product>;
  isInitial: boolean = true;
  uploading: boolean = false;
  active: number = 0;
  newProd: Product = new Product(null, null, null, null, null, null, null, null, null);
  newlyadded: any = { "key": "isNew", "value": true };
  @Input('user') user: User;
  @Input('modalActions') modalActions: any;

  constructor(private utilsService: UtilsService, private fileService: FileService, private productService: ProductService) { 
    this.uploadsURL = utilsService.getUploadsURL();    
  }

  uploadedImage(res: any, me: any) {
    me.uploading = false;
    if(res && res.success)
      me.newProd.imageURL = res.fileName;
    else
      me.imgErrMsg = res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.';
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

  ngOnInit() {
  }

  initialize(ps: Array<Product>) {
    if(ps && ps.length > 0)
      this.products = ps;
    else
      this.active = 1;
    let me = this;
  }

  setActiveTab(tab: number) {
    if(this.active != tab) {
      this.active = tab;
      this.isInitial = false;
    }
  }

  addedProduct(p: Product) {
    if(p && p.price > 0)
      this.newProd = new Product(null, null, null, null, null, null, null, null, null);
    else
      this.imgErrMsg = this.utilsService.returnGenericError().errMsg;
  }

  addProduct() {
    if(this.newProd.name && this.newProd.price > 0) {
      this.productService.addProduct(this.user.merchantCode, this.newProd)
        .then(res => this.addedProduct(res));
    }
  }

  close() {
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }
}
