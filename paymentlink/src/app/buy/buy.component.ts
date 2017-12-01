import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Product, ProductService, SDK, SDKService, UtilsService } from 'benowservices';

@Component({
  selector: 'buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  id: string;
  uploadsURL: string;
  merchantCode: string;
  sdk: SDK;
  products: Array<Product>;

  constructor(private route: ActivatedRoute, private productService: ProductService, private router: Router, private sdkService: SDKService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.merchantCode = this.route.snapshot.params['code'];
    this.sdkService.getPaymentLinkDetails(this.id)
      .then(res => this.initProducts(res));
  }

  getTotal() {
    let total: number = 0;
    if(this.products && this.products.length > 0) {
      for(let i:number = 0; i < this.products.length; i++){
        if(this.products[i].qty > 0) {
          total += this.products[i].qty * this.products[i].price;
        }
      }
    }

    return total;
  }

  initProducts(res: SDK) {
    if(res && res.id) {
      this.sdk = res;
      this.productService.getProductsForCampaign(this.merchantCode, this.id)
        .then(res => this.init(res));
    }
    else
      this.router.navigateByUrl('/notfound');
  }

  init(res: Array<Product>) {
    if(res && res.length > 0) {
      this.uploadsURL = this.utilsService.getUploadsURL();
      this.products = res;
    }
    else {
      if(this.sdk.mtype == 2)
        this.router.navigateByUrl('/donate/' + this.id);
      else
        this.router.navigateByUrl('/pay/' + this.id);

    }
  }

  isInvalid(): boolean {
    return this.getTotal() <= 0;
  }

  buy() {
    let total: number = this.getTotal();
    if(total > 0) {
      let input: Array<any> = new Array<any>();
      let selProds: Array<Product> = new Array<Product>();
      for(let i: number = 0; i < this.products.length; i++) {
        if(this.products[i].isSelected) {
          input.push({
            "id": this.products[i].id,
            "qty": this.products[i].qty
          });
          selProds.push(this.products[i]);
        }
      }

      this.sdkService.setProductsInSDK(selProds);
      if(this.sdk.mtype == 2)
        this.router.navigateByUrl('/donate/' + this.id + '/' + btoa(JSON.stringify(input))); 
      else
        this.router.navigateByUrl('/pay/' + this.id + '/' + btoa(JSON.stringify(input))); 
    }
  }
}
