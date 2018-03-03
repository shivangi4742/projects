import { Component, OnInit, Input } from '@angular/core';

import { Product } from 'benowservices';

@Component({
  selector: 'prodwidget',
  templateUrl: './prodwidget.component.html',
  styleUrls: ['./prodwidget.component.css']
})
export class ProdwidgetComponent implements OnInit {
  @Input('product') product: Product;

  constructor() { }

  ngOnInit() {
    console.log(this.product);
  }

}
