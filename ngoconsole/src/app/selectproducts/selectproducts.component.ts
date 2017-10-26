import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import { User, UtilsService, Product, FileService, ProductService } from 'benowservices';

@Component({
  selector: 'selectproducts',
  templateUrl: './selectproducts.component.html',
  styleUrls: ['./selectproducts.component.css']
})
export class SelectproductsComponent implements OnInit {
  products: Array<Product>;
  isInitial: boolean = true;
  active: number = 0;
  newProd: Product = new Product(null, null, null, null, null, null, null, null, null, null);
  newlyadded: any = { "key": "isNew", "value": true };
  @Input('user') user: User;
  @Input('modalActions') modalActions: any;

  constructor(private utilsService: UtilsService, private fileService: FileService, private productService: ProductService) { }

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
}
