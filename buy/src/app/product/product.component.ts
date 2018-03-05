import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Product, Variant, ProductService } from 'benowservices';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  id: string;
  selectedImage: string;
  product: Product;
  images: Array<string>;
  suggestedProds: Array<Product>;
  imgPage: number = 0;
  numImgPages: number = 1;

  constructor(private productService: ProductService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.productService.getProduct(this.id)
      .then(res => this.init(res));
  }

  selectImg(img: string) {
    this.selectedImage = img;
  }

  nextImgPage() {
    this.images = new Array<string>();
    for(let i: number = 5; i < this.product.imageURLs.length; i++) {
      this.images.push(this.product.imageURLs[i]);
      if(this.images.length >= 5)
        break;
    }

    this.imgPage = 0;
  }

  prevImgPage() {
    this.images = new Array<string>();
    for(let i: number = 0; i < 5; i++)
      this.images.push(this.product.imageURLs[i]);

    this.imgPage = 1;
  }

  hasWrongQty(): boolean {
    if(!this.product.qty)
      return true;

    if(this.product.qty < 1)
      return true;

    if(this.product.qty - Math.round(this.product.qty) > 0)
      return true;

    return false;
  }

  init(res: Product) {
    res = new Product(false, false, false, null, 10, 10, "2995", "2995", "Second Product", "Testing API second", "",
      "https://mobilepayments.benow.in/merchants/merchant/document/15/adb720d0-1b9f-11e8-ba0e-8b81e1c5fb46redCircle.png", null, null, 
      [new Variant(null, 30, 30, "7", "Red", ["X", "XL"]), new Variant(null, 20, 20, "8", "Blue", ["M", "S", "X"])],
      ["https://mobilepayments.benow.in/merchants/merchant/document/15/adb720d0-1b9f-11e8-ba0e-8b81e1c5fb46redCircle.png"]);

    if(res && res.id) {
      this.product = res;      
      this.product.qty = 1;
      this.numImgPages = Math.round(this.product.imageURLs.length / 6) + 1;
      if(this.numImgPages == 1)
        this.images = this.product.imageURLs;
      else {
        this.images = new Array<string>();
        for(let i: number = 0; i < 5; i++)
          this.images.push(this.product.imageURLs[i]);
      }

      this.selectedImage = this.images[0];
    }
  }
}
