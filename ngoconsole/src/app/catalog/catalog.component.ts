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
  newProducts: Array<Product>;
  loading: boolean = false;
  isInitial: boolean = true;
  pg: number = 1;
  active: number = 0;
  numPages: number = 1;
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

  added(e: any) {
    if(e && e.id) {
      if(!this.newProducts)
        this.newProducts = new Array<Product>();

      this.newProducts.splice(0, 0, e);
      this.productService.getProducts(this.user.merchantCode, this.pg)
        .then(ps => this.initNewProducts(ps, false));    
    }
  }

  deleted(e: string) {
    this.productService.getProducts(this.user.merchantCode, this.pg)
      .then(ps => this.initNewProducts(ps, true));    

    if(this.newProducts && this.newProducts.length > 0) {
      for(let i: number = 0; i < this.newProducts.length; i++) {
        if(this.newProducts[i].id == e) {
          this.newProducts.splice(i, 1);
          break;
        }          
      }
    }
  }

  getStatus() {
    return this.utilsService.getStatus();
  }

  private initNewProducts(res: any, isdel: boolean) {
    if(res && res.products && res.products.length > 0) {
      if(!this.products)
        this.products = new Array<Product>();

      for(let i: number = this.products.length - 1; i >= 0; i--) {
        let op = res.products.filter(p => p.id == this.products[i].id);
        if(!(op && op.length > 0))
          this.products.splice(i, 1);
      }

      for(let i: number = 0; i < res.products.length; i++) {
        let ip = this.products.filter(p => p.id == res.products[i].id);
        if(!(ip && ip.length > 0)) {
          if(isdel)
            this.products.push(res.products[i]);
          else
            this.products.splice(0, 0, res.products[i]);
        }
      }

      this.numPages = res.numPages;
    }
    else if(res.success != false) {
      if(isdel) {
        if(this.pg > 1) {
          this.numPages--;
          this.productService.getProducts(this.user.merchantCode, --this.pg)
            .then(ps => this.initProducts(ps, true));    
        }
        else {
          this.active = 1;    
          this.products = null;
        }
      }
      else
        this.active = 1;    
    }
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
