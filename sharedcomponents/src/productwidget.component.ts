import { Component, Input } from '@angular/core';

import { Product, UtilsService } from 'benowservices';

@Component({
  selector: 'productwidget',
  templateUrl: './assets/shared/templates/productwidget.component.html',
  styleUrls: ['./assets/shared/styles/productwidget.component.css']
})
export class ProductWidgetComponent  {
  uploadsURL: string;
  @Input('showDelete') showDelete: boolean;
  @Input('product') product: Product;

  constructor(private utilsService: UtilsService) {
      this.uploadsURL = utilsService.getUploadsURL();
  }

  select() {
    this.product.isSelected = !this.product.isSelected;
  }

  priceChanged() {
    if(this.product.price <= 0)
      this.product.price = this.product.originalPrice;
  }

  delete() {

  }
}
