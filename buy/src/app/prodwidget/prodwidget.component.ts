import { Component, OnInit, Input } from '@angular/core';

import { Product } from 'benowservices';

@Component({
  selector: 'prodwidget',
  templateUrl: './prodwidget.component.html',
  styleUrls: ['./prodwidget.component.css']
})
export class ProdwidgetComponent implements OnInit {
  productLink: string;
  @Input('product') product: Product;

  constructor() { }

  ngOnInit() {
    this.productLink = '/product/' + this.product.id;
  }
}
