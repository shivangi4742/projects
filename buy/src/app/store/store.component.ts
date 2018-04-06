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
  retPolicy: string;
  storeName: string;
  storeLogo: string;
  storeEmail: string;
  retPolicy1: string;
  retPolicy2: string;
  storeContact: string;
  storeAddress: string;
  merchantCode: string;
  products: Array<Product>;
  page: number = 1;
  onclickn : boolean = false;
  //HARDCODED
//  storeimage: string = 'https://boygeniusreport.files.wordpress.com/2016/12/amazon-go-store.jpg?quality=98&strip=all&w=782';

  constructor(private activatedRoute: ActivatedRoute, private storeService: StoreService, private utilsService: UtilsService,
    private productService: ProductService) { }

  ngOnInit() {
    let imgHeight: number = Math.round((screen.height - 100) * 0.5);
    let gap: number = imgHeight > 150 ? imgHeight - 90 : 100;
//    document.getElementById('storeimgdiv').style.backgroundImage = "url('" + this.storeimage + "')";
    document.getElementById('storeimgdiv').style.backgroundColor = 'white';
    document.getElementById('storeimgdiv').style.height = imgHeight.toString() + 'px';
    document.getElementById('clearingdiv').style.marginTop = "-" + imgHeight.toString() + 'px';
    document.getElementById('clearingdiv').style.height =  gap.toString() + 'px';
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    if(this.merchantCode) {
      this.storeService.assignMerchant(this.merchantCode);
      this.fetchProducts();
      this.storeService.fetchStoreDetails(this.merchantCode)
        .then(res => this.fillStoreDetails(res));  
    }
    else
      this.newInit();
  }

  fillMerchantDetails(m: any) {
    if(m && m.merchantCode) {
      this.merchantCode = m.merchantCode;
      this.storeService.assignMerchant(this.merchantCode);
      this.fetchProducts();
      this.storeService.fetchStoreDetails(this.merchantCode)
        .then(res => this.fillStoreDetails(res));    
    }
  }

  newInit() {
    this.storeService.getMerchantDetailsFromURL()
      .then(res => this.fillMerchantDetails(res));
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

  fillReturnPolicy(res: any) {
    if(res) {
      if(res.contactSeller)
        this.retPolicy = 'Contact the seller';
      else if(res.noReturnExchange)
        this.retPolicy = 'No returns or echanges';
      else if(res.productExchange) {
        this.retPolicy = "Exchange only on faulty products within";
        this.retPolicy1 = res.productExchangeDay ? res.productExchangeDay.toString() : '';
        this.retPolicy2 = "days of return. (No returns)";
      }
      else if(res.productReturnOrExchange) {
        this.retPolicy = "Returns / exchange only on faulty products within";
        this.retPolicy1 = res.productReturnOrExchangeDay ? res.productReturnOrExchangeDay.toString() : '';
        this.retPolicy2 = "days.";
      }
      else if(res.returnAvailable) {
        this.retPolicy = "Returns available within";
        this.retPolicy1 = res.returnsAvailableDay ? res.returnsAvailableDay.toString() : '';
        this.retPolicy2 = "days.";
      }
      else if(res.noExchangeFlage)
        this.retPolicy = "No questions asked exchange.";
      else if(res.noReturnFlage) 
        this.retPolicy = "No questions asked return.";
    }
  }

  fillStoreDetails(res: any) {
    if(res && res.id) {
      this.storeAddress = res.address;
      this.storeName = res.displayName;
      this.storeContact = res.mobileNumber;
      this.storeEmail = res.userId;
      this.fillReturnPolicy(res);
      if(res.logoURL)
        this.storeLogo = this.utilsService.getDocumentsPrefixURL() + res.logoURL;
      else
        this.storeLogo = this.utilsService.getDefaultStoreImageURL();
    }
  }
  abtbusiness(){
    this.onclickn = ! this.onclickn;
  }
}
