import { Component, OnInit, Input, EventEmitter, ViewChild, AfterViewInit, Output } from '@angular/core';

import { MaterializeAction } from 'angular2-materialize';

import { Product, UtilsService, ProductService, User } from 'benowservices';

import { AddproductComponent } from './../addproduct/addproduct.component';

@Component({
  selector: 'productline',
  templateUrl: './productline.component.html',
  styleUrls: ['./productline.component.css']
})
export class ProductlineComponent implements OnInit, AfterViewInit {
  uploadsURL: string;
  deleting: boolean = false;
  @Input('product') product: Product;
  @Input('user') user: User;
  @ViewChild(AddproductComponent) apc: AddproductComponent;
  @Output()
  deletedProd: EventEmitter<string> = new EventEmitter();
  modalActions: any = new EventEmitter<string|MaterializeAction>();
  constructor(private utilsService: UtilsService, private productService: ProductService) { 
    this.uploadsURL = utilsService.getUploadsURL();
  }

  ngOnInit() {
  }

  deleted(res: Boolean) {
    if(res == true)
      this.deletedProd.emit(this.product.id);
    else
      this.deleting = false;
  }

  delete() {
    this.deleting = true;
    this.productService.deleteProduct(this.product.id)
      .then(res => this.deleted(res))
  }

  enabled(): boolean {
    return this.apc.canBeSaved(this.product);
  }

  saved(res: any, newProd: Product) {
    if(res == true) {
      this.product.id = newProd.id;
      this.product.uom = newProd.uom;
      this.product.name = newProd.name;
      this.product.price = newProd.price;
      this.product.imageURL = newProd.imageURL;
      this.product.description = newProd.description;
      this.modalActions.emit({ action: "modal", params: ['close'] });        
    }
  }

  save() {
    let newProd: Product = this.apc.getEditedProduct();
    this.productService.editProduct(this.user.merchantCode, newProd)
      .then(res => this.saved(res, newProd));
  }

  cancel() {
    this.modalActions.emit({ action: "modal", params: ['close'] });    
  }

  edit() {
    this.apc.setProduct(this.product);
    this.modalActions.emit({ action: "modal", params: ['open'] });
  }  

  ngAfterViewInit() { }
}
