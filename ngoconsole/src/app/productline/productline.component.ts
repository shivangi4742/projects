import { Component, OnInit, Input } from '@angular/core';

import { Product, UtilsService, ProductService } from 'benowservices';

@Component({
  selector: 'productline',
  templateUrl: './productline.component.html',
  styleUrls: ['./productline.component.css']
})
export class ProductlineComponent implements OnInit {
  uploadsURL: string;
  @Input('product') product: Product;
  constructor(private utilsService: UtilsService, private productService: ProductService) { 
    this.uploadsURL = utilsService.getUploadsURL();
  }

  ngOnInit() {
  }

  deleted(res: any) {
    console.log(res);
  }

  delete() {
    this.productService.deleteProduct(this.product.id)
      .then(res => this.deleted(res))
  }

  edit() {
  }
}
