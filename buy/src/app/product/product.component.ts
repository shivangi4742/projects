import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Product, ProductService } from 'benowservices';

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

  prevImgPage() {
    this.images = ['http://cdn-image.foodandwine.com/sites/default/files/styles/4_3_horizontal_-_1200x900/public/1497373301/beringer-founders-estate-cabernet-sauvignon-best-affordable-wines-FT-SS0617.jpg?itok=aWEl_tcM',
      'https://cdn.shopify.com/s/files/1/0917/5854/products/CabSauv_WEB.jpg?v=1501285376',
      'data:image/jpeg;base64,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',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKkTX2Nkpj81fJUNDXI-FEhPhcTwhoQ2ngwGbrtjpHuhlmiVF4',
      'https://drizly-products2.imgix.net/ci_1354.jpg?auto=format%2Ccompress&dpr=2&fm=jpeg&h=240&q=20'];
    this.imgPage = 0;
  }

  nextImgPage() {
    this.images = ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOV6d6F0ATLa3tf3YiAx7WtO5M17Qh4FnuxP-U4vVonlK9MC6p',
      'http://cdn-image.foodandwine.com/sites/default/files/styles/4_3_horizontal_-_1200x900/public/1505139617/nv-pol-roger-brut-reserve-white-foil-wine-masters-FT-MAG1017.jpg?itok=EYKN82v4',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvJIkezX5RvgO00V-LzACRxGsNtZtNeJDSiWHnP46BVDfKCiVbdw',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsVSSJYc2FqZWuZDxj_zDjkUJ_0A9gTGBNzugXQkCIFGnjJSbuAA'];
    this.imgPage = 1;
  }

  init(res: Product) {
    if(res && res.id) {
      this.product = res;
      this.numImgPages = 2;
      this.images = ['http://cdn-image.foodandwine.com/sites/default/files/styles/4_3_horizontal_-_1200x900/public/1497373301/beringer-founders-estate-cabernet-sauvignon-best-affordable-wines-FT-SS0617.jpg?itok=aWEl_tcM',
        'https://cdn.shopify.com/s/files/1/0917/5854/products/CabSauv_WEB.jpg?v=1501285376',
        'data:image/jpeg;base64,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',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKkTX2Nkpj81fJUNDXI-FEhPhcTwhoQ2ngwGbrtjpHuhlmiVF4',
        'https://drizly-products2.imgix.net/ci_1354.jpg?auto=format%2Ccompress&dpr=2&fm=jpeg&h=240&q=20'];
      this.selectedImage = this.images[0];
      this.suggestedProds = [res, res, res, res];
    }
  }
}
