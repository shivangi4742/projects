import { Component, OnInit, Input } from '@angular/core';

import { Product } from 'benowservices';

@Component({
  selector: 'prodwidget',
  templateUrl: './prodwidget.component.html',
  styleUrls: ['./prodwidget.component.css']
})
export class ProdwidgetComponent implements OnInit {
  productLink: string;
  numVariants: number = 0;
  @Input('product') product: Product;

  constructor() { }

  ngOnInit() {
    if(this.product) {
      if(window && window.location && window.location.href && window.location.href.toLowerCase().indexOf('/product/') < 0)
        this.productLink = '/product/' + this.product.id;
      else
        this.productLink = '/product2/' + this.product.id;
      
      if(this.product.variants && this.product.variants.length > 0)
        this.numVariants = this.product.variants.length;
    }
  }
}
