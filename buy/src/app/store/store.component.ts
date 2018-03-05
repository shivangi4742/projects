import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { Product, StoreService, UtilsService, ProductService } from 'benowservices';

@Component({
  selector: 'store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  numPages: number;
  storeName: string;
  storeLogo: string;
  storeContact: string;
  storeAddress: string;
  merchantCode: string;
  products: Array<Product>;
  page: number = 1;

  //HARDCODED
  storeimage: string = 'https://boygeniusreport.files.wordpress.com/2016/12/amazon-go-store.jpg?quality=98&strip=all&w=782';

  constructor(private activatedRoute: ActivatedRoute, private storeService: StoreService, private utilsService: UtilsService,
    private productService: ProductService) { }

  ngOnInit() {
    document.getElementById('storeimgdiv').style.backgroundImage = "url('" + this.storeimage + "')";
    document.getElementById('storeimgdiv').style.height = Math.round((screen.height - 100) * 0.5).toString() + 'px';
    document.getElementById('clearingdiv').style.height = Math.round((screen.height - 250) * 0.4).toString() + 'px';
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    this.fetchProducts();
    this.storeService.fetchStoreDetails(this.merchantCode)
      .then(res => this.fillStoreDetails(res));
  }

  fetchProducts() {
    this.productService.getProductsForStore(this.merchantCode, this.page)
      .then(res => this.fillProductsInStore(res));
  }

  more() {
    this.page++;
    this.fetchProducts();
  }

  fillProductsInStore(res: any) {
    if(res && res.numPages > 0) {
      this.numPages = res.numPages;
      if(!this.products)
        this.products = new Array<Product>();

      if(res && res.products && res.products.length > 0) {
        let me: any = this;
        res.products.forEach(function(p: Product) {
          me.products.push(p);
        });
      }
    }
  }

  fillStoreDetails(res: any) {
    if(res && res.id) {
      this.storeAddress = res.address;
      this.storeName = res.displayName;
      this.storeContact = res.mobileNumber;
      if(res.logoURL)
        this.storeLogo = this.utilsService.getDocumentsPrefixURL() + res.logoURL;
      else
        this.storeLogo = this.utilsService.getDefaultStoreImageURL();
    }
  }
}
