import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Product, UtilsService } from 'benowservices';

@Component({
  selector: 'newproductwidget',
  templateUrl: './assets/shared/templates/newproductwidget.component.html',
  styleUrls: ['./assets/shared/styles/newproductwidget.component.css']
})
export class NewProductWidgetComponent  {
  isChecked: boolean = false;
  expandedDesc: boolean = false;
  hasShortDesc: boolean = false;
  uploadsURL: string;
  @Input('product') product: Product;  
  @Output()
  selectedProd: EventEmitter<any> = new EventEmitter();

  constructor(private utilsService: UtilsService) {
    this.uploadsURL = utilsService.getUploadsURL();
  }

  getShortDescription(): string {
    if(!this.product.description || this.product.description.trim().length < 120) {
        this.expandedDesc = true;        
        return this.product.description.trim();
    }

    this.hasShortDesc = true;
    return this.product.description.trim().substring(0, 120);
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
