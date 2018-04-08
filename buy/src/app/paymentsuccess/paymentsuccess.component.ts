import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product, ProductService, StoreService, CartItem, UtilsService, CartService } from 'benowservices';

@Component({
  selector: 'paymentsuccess',
  templateUrl: './paymentsuccess.component.html',
  styleUrls: ['./paymentsuccess.component.css']
})
export class PaymentsuccessComponent implements OnInit {
  id: string;
  homeLink: string;
  merchantCode: string;
  items: Array<CartItem>;

  constructor(private productService: ProductService, private storeService: StoreService, private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService, private cartService: CartService) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    if(this.merchantCode) {
      this.homeLink = '/' + this.merchantCode + '/store';
      this.storeService.assignMerchant(this.merchantCode);
      this.productService.getProductsForTransaction(null, this.id)
        .then(res => this.bindProds(res));  
    }
    else {
      this.storeService.getMerchantDetailsFromURL()
        .then(res => this.fillMerchantDetails(res));    
    }
  }

  fillMerchantDetails(m: any) {
    if(m && m.merchantCode) {
      this.merchantCode = m.merchantCode;
      this.homeLink = window.location.href;
      let u: string = window.location.href;
      if(u) {
        let indx = u.indexOf('.benow.in');
        if(indx > 0)
          this.homeLink = u.substring(0, indx);
      }

      this.storeService.assignMerchant(this.merchantCode);
    }
  }

  bindProds(res: Array<Product>) {
    if(res && res.length > 0) {
      this.items = new Array<CartItem>();
      for(let i: number = 0; i < res.length; i++) {
        let imgURL: string = res[i].imageURL ? this.utilsService.getUploadsURL() + res[i].imageURL : this.utilsService.getNoProdImageURL();
        this.items.push(new CartItem(res[i].qty, res[i].prodId, res[i].name, res[i].originalPrice, res[i].price, imgURL, null, null, res[i].color,
          res[i].size, res[i].description));
      }

      this.cartService.clearFromCart(this.merchantCode, this.items);
    }
  }

}
