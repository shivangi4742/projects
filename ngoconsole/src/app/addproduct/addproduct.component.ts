import { Component, Input, OnInit } from '@angular/core';

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
  @Input('user') user: User;
  constructor(private productService: ProductService, private utilsService: UtilsService, private fileService: FileService) { 
    this.uploadsURL = utilsService.getUploadsURL();        
  }

  ngOnInit() {
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
    if(p && p.price > 0)
      this.newProd = new Product(null, null, null, null, null, null, null, null, null, null);
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
