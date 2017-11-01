import { Component, OnInit } from '@angular/core';

import { Product, ProductService, UserService, User, UtilsService } from 'benowservices';

@Component({
  selector: 'catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  user: User;
  products: Array<Product>;
  loading: boolean = false;
  isInitial: boolean = true;
  pg: number = 1;
  active: number = 0;
  numPages: number = 1;
  newlyadded: any = { "key": "isNew", "value": true };
  constructor(private productService: ProductService, private userService: UserService, private utilsService: UtilsService) { }

  ngOnInit() {
    this.userService.getUser()
      .then(res => this.initUser(res));
  }

  previous() {
    this.productService.getProducts(this.user.merchantCode, --this.pg)
      .then(ps => this.initProducts(ps, false));
    this.loading = true;
    window.scrollTo(0, 0);
  }

  next() {
    this.productService.getProducts(this.user.merchantCode, ++this.pg)
      .then(ps => this.initProducts(ps, false));
    this.loading = true;
    window.scrollTo(0, 0);
  }

  deleted(e: any) {
    this.productService.getProducts(this.user.merchantCode, this.pg)
      .then(ps => this.initNewProducts(ps));    
  }

  getStatus() {
    return this.utilsService.getStatus();
  }

  private initNewProducts(res: any) {
    if(res && res.products && res.products.length > 0) {
      for(let i = this.products.length - 1; i >= 0; i--) {
        let op = res.products.filter(p => p.id == this.products[i].id);
        if(!(op && op.length > 0)) {
          console.log('spliced', this.products[i]);
          this.products.splice(i, 1);
        }
      }

      for(let i = 0; i < res.products.length; i++) {
        let ip = this.products.filter(p => p.id == res.products[i].id);
        if(!(ip && ip.length > 0)) {
          console.log('pushed', res.products[i]);
          this.products.push(res.products[i]);
        }
      }

      this.numPages = res.numPages;
    }
    else
      this.active = 1;    
  }

  private initProducts(res: any, isInit: boolean) {
    this.loading = false;
    if(res && res.products && res.products.length > 0) {
      this.products = res.products;
      this.numPages = res.numPages;
    }
    else if(isInit)
      this.active = 1;
  }

  private initUser(res: User) {
    if(res) {
      this.user = res;
      this.productService.getProducts(this.user.merchantCode, this.pg)
        .then(ps => this.initProducts(ps, true));
    }
  }

  setActiveTab(t: number) {
    if(this.active != t) {
      this.active = t;
      this.isInitial = false;
    }
  }

  goToDashboard() {
    window.location.href = this.utilsService.getOldDashboardURL();    
  }
}
