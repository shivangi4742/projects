import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Product, UtilsService } from 'benowservices';

@Component({
  selector: 'productwidget',
  templateUrl: './assets/shared/templates/productwidget.component.html',
  styleUrls: ['./assets/shared/styles/productwidget.component.css']
})
export class ProductWidgetComponent  {
  isChecked: boolean = false;
  uploadsURL: string;
  @Input('editQty') editQty: boolean;
  @Input('forCart') forCart: boolean;
  @Input('mtype') mtype: number;
  @Input('product') product: Product;
  @Output()
  selectedProd: EventEmitter<any> = new EventEmitter();

  constructor(private utilsService: UtilsService) {
      this.uploadsURL = utilsService.getUploadsURL();
  }

  checked() {
    this.isChecked = !this.isChecked;
    if(this.isChecked)
      this.product.qty = 1;
    else
      this.product.qty = null;
  }

  sel(e: any) {
    if(e && e.target)
      this.selectedProd.emit({ "product": this.product, "checked": e.target.checked });
  }

  select() {
    this.product.isSelected = true;
  }

  qtyChanged() {
    if(!this.product.qty || this.product.qty <= 0)
        this.product.qty = 1;
  }

  priceChanged() {
    if(this.product.price <= 0)
      this.product.price = this.product.originalPrice;
  }
}
