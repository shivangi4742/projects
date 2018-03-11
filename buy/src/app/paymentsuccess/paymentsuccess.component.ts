import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product, ProductService, StoreService, CartItem, UtilsService } from 'benowservices';

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
    private utilsService: UtilsService) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    this.homeLink = '/' + this.merchantCode + '/store';
    this.storeService.assignMerchant(this.merchantCode);
    this.productService.getProductsForTransaction(null, this.id)
      .then(res => this.bindProds(res));
  }

  bindProds(res: Array<Product>) {
    console.log(res);
    if(res && res.length > 0) {
      this.items = new Array<CartItem>();
      for(let i: number = 0; i < res.length; i++) {
        let imgURL: string = res[i].imageURL ? this.utilsService.getUploadsURL() + res[i].imageURL : this.utilsService.getNoProdImageURL();
        this.items.push(new CartItem(res[i].qty, res[i].prodId, res[i].name, res[i].originalPrice, res[i].price, imgURL, null, null, res[i].color,
          res[i].size, res[i].description));
      }
      //this.clearFromCart(res)
    }
    //clear from cart too
  }

}
