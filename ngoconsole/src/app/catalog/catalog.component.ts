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
  isInitial: boolean = true;
  active: number = 0;
  constructor(private productService: ProductService, private userService: UserService, private utilsService: UtilsService) { }

  ngOnInit() {
    this.userService.getUser()
      .then(res => this.initUser(res));
  }

  private initProducts(ps: Array<Product>) {
    if(ps && ps.length > 0)
      this.products = ps;
    else
      this.active = 1;
  }

  private initUser(res: User) {
    if(res) {
      this.user = res;
      this.productService.getProducts(this.user.merchantCode)
        .then(ps => this.initProducts(ps));
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
