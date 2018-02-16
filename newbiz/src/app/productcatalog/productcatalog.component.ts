import { Component, OnInit } from '@angular/core';

import { UtilsService, User, UserService, LocationService, Product, ProductService } from 'benowservices';

@Component({
  selector: 'app-productcatalog',
  templateUrl: './productcatalog.component.html',
  styleUrls: ['./productcatalog.component.css']
})
export class ProductcatalogComponent implements OnInit {

  user: User;
  dashboard: string = '/dashboard';
  uploadsURL: string;
  searchText: string;
  products: Array<Product>;
  page: number = 1;
  numPages: number = 0;
  processing: boolean = false;
  deleting: boolean = false;

  constructor(private locationService: LocationService, private userService: UserService, private utilsService: UtilsService,
              private productService: ProductService) {
    this.uploadsURL = utilsService.getUploadsURL();
  }

  ngOnInit() {
    this.locationService.setLocation('catalogue');

    this.userService.getUser()
      .then(res => this.init(res));
  }

  init(res: User){
    this.user = res;

    this.productService.getProducts(this.user.merchantCode, this.page)
      .then(pres => this.updateProds(pres));
  }

  updateProds(res: any){
    this.numPages = res.numPages;
    this.products = res.products;

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
      .then(res => this.deleted(res))
  }

}
