import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Product, Variant, ProductService, StoreService, UtilsService, CartService, Size } from 'benowservices';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productPrice: number;
  productOriginalPrice: number;
  id: string;
  home: string;
  merchantCode: string;
  selectedImage: string;
  product: Product;
  selectedSize: Size;
  images: Array<string>;
  availableSizes: Array<Size>;
  suggestedProds: Array<Product>;
  loaded: boolean = false;
  imgPage: number = 0;
  numImgPages: number = 1;
  selVariant: string = '-1';

  constructor(private productService: ProductService, private router: Router, private activatedRoute: ActivatedRoute,
    private storeService: StoreService, private utilsService: UtilsService, private cartService: CartService) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    this.home = '/' + this.merchantCode + '/store';
    this.storeService.assignMerchant(this.merchantCode);
    this.productService.getProduct(this.id)
      .then(res => this.init(res));    

    this.productService.getProductsForStore(this.merchantCode, 1)
      .then(res2 => this.initRecommendations(res2));      
  }

  initRecommendations(res: any) {
    if(res && res.products && res.products.length > 0) {
      for(let i: number = 0; i < res.products.length; i++) {
        if(!this.product || res.products[i].id != this.product.id) {
          if(!this.suggestedProds)
            this.suggestedProds = new Array<Product>();
          
          this.suggestedProds.push(res.products[i]);
          if(this.suggestedProds.length >= 4)
            break;
        }
      }
    }
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

  selectVariant(v: Variant) {
    if(!v) {
      this.selVariant = '-1';
      this.product.originalPrice = this.productOriginalPrice;
      this.product.price = this.productPrice;
      this.availableSizes = this.product.sizes;
    }
    else {
      this.selVariant = v.id;
      this.product.originalPrice = v.originalPrice;
      this.product.price = v.price;
      this.availableSizes = v.sizes;
    }

    if(this.availableSizes && this.availableSizes.length > 0) {
      let match: Array<Size> = this.availableSizes.filter(s => s.id == this.selectedSize.id);
      if(!(match && match.length > 0))
        this.selectedSize = this.availableSizes[0];
    } 
  }

  selectSize(size: Size) {
    this.selectedSize = size;
  }

  isSysColor(col: string) {
    return this.utilsService.isSysColor(col);
  }

  getColClass(col: string, vrnt: string): string {
    if(col) {
      if(vrnt == this.selVariant)
        return 'tooltip linkButtonBN selectedcoloptionBN colchipBN ' + col.trim().toLowerCase().replace(/ /g, '') + 'CBN';
      else
        return 'tooltip linkButtonBN colchipBN ' + col.trim().toLowerCase().replace(/ /g, '') + 'CBN';
    }
    
    return '';
  }

  addToCart() {
    this.cartService.addToCart(this.merchantCode, this.product, this.selVariant, this.selectedSize ? this.selectedSize.id : '', this.product.qty);
  }

  buy() {
    this.addToCart();
    this.router.navigateByUrl('/' + this.merchantCode + '/cart');
  }

  init(res: Product) {
    if(res && res.id && res.merchantCode == this.merchantCode) {
      this.product = res;      
      this.product.qty = 1;
      this.productPrice = this.product.price;
      this.productOriginalPrice = this.product.originalPrice;
      this.availableSizes = this.product.sizes;
      if(this.availableSizes && this.availableSizes.length > 0)
        this.selectedSize = this.availableSizes[0];

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

    this.loaded = true;
  }
}
