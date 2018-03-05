import {Component, OnInit, Input, EventEmitter, ViewChild} from '@angular/core';

import { User, UtilsService, Product, FileService, ProductService } from 'benowservices';

@Component({
  selector: 'selectproducts',
  templateUrl: './selectproducts.component.html',
  styleUrls: ['./selectproducts.component.css']
})
export class SelectproductsComponent implements OnInit {
  products: Array<Product>;
  newProducts: Array<Product>;
  selectedProducts: Array<Product>;
  loading: boolean = false;
  isInitial: boolean = true;
  pg: number = 1;
  active: number = 0;
  numPages: number = 1;
  mtype: number = 1;
  newProd: Product = new Product(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
  @Input('user') user: User;
  @Input('modalActions') modalActions: any;

  constructor(private utilsService: UtilsService, private fileService: FileService, private productService: ProductService) { }

  ngOnInit() {
  }

  selected(e: any) {
    if(e && e.product && e.product.id) {
      let p: Array<Product>;
      let sp: Array<Product>;
      let np: Array<Product>;
      if(this.products && this.products.length > 0)
        p = this.products.filter(pp => pp.id == e.product.id);

      if(this.selectedProducts && this.selectedProducts.length > 0)
        sp = this.selectedProducts.filter(pp => pp.id == e.product.id);

      if(this.newProducts && this.newProducts.length > 0)
        np = this.newProducts.filter(pp => pp.id == e.product.id);

      if(p && p.length > 0)
        p[0].isSelected = e.checked;

      if(np && np.length > 0)
        np[0].isSelected = e.checked;

      if(e.checked) {
        this.selectedProducts = this.productService.getSelectedProducts();
        if(!this.selectedProducts)
          this.selectedProducts = new Array<Product>();

        if(!(sp && sp.length > 0)) {
          this.selectedProducts.push(e.product);
          this.selectedProducts[this.selectedProducts.length - 1].isSelected = true;
        }
      }
      else {
        if(sp && sp.length > 0) {
          for(let i: number = 0; i < this.selectedProducts.length; i++) {
            if(this.selectedProducts[i].id == e.product.id) {
              this.selectedProducts.splice(i, 1);
              break;
            }
          }
        }
      }
    }

    this.productService.setSelectedProducts(this.selectedProducts);
  }

  added(e: Product) {
    if(e && e.id) {
      if(!this.selectedProducts)
        this.selectedProducts = new Array<Product>();

      if(!this.newProducts)
        this.newProducts = new Array<Product>();

      this.newProducts.splice(0, 0, e);
      this.selectedProducts.push(e);
      this.productService.setSelectedProducts(this.selectedProducts);
      this.productService.getProducts(this.user.merchantCode, this.pg)
        .then(ps => this.initializeProds(ps, false));
    }
  }

  previous() {
    this.productService.getProducts(this.user.merchantCode, --this.pg)
      .then(ps => this.initializeProds(ps, false));
    this.loading = true;
    let w: any = document.getElementById('productsModalContent');
    if(w)
      w.scrollTop = 0;
  }

  next() {
    this.productService.getProducts(this.user.merchantCode, ++this.pg)
      .then(ps => this.initializeProds(ps, false));
    this.loading = true;
    let w: any = document.getElementById('productsModalContent');
    if(w)
      w.scrollTop = 0;
  }

  initialize() {
    if(this.utilsService.isHB(this.user.merchantCode, this.user.lob))
      this.mtype = 3;
    else if(this.utilsService.isNGO(this.user.mccCode))
      this.mtype = 2;

    if(!this.products || this.products.length <= 0) {
      this.pg = 1;
      this.loading = true;
      this.productService.getProducts(this.user.merchantCode, this.pg)
        .then(res => this.initializeProds(res, true));
    }
  }

  initializeProds(res: any, isinit: boolean) {
    this.loading = false;
    if(res && res.products && res.products.length > 0) {
      this.products = res.products;
      this.numPages = res.numPages;
      if(this.selectedProducts && this.selectedProducts.length > 0) {
        for(let i: number = 0; i < this.products.length; i++) {
          let sp: Array<Product> = this.selectedProducts.filter(p => p.id == this.products[i].id);
          if(sp && sp.length > 0)
            this.products[i].isSelected = true;
        }
      }
    }
    else if(isinit)
      this.active = 1;
  }

  setActiveTab(tab: number) {
    if(this.active != tab) {
      this.active = tab;
      this.isInitial = false;
    }
  }
}
