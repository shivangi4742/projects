import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { Product, StoreService, UtilsService } from 'benowservices';

@Component({
  selector: 'store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  storeName: string;
  storeLogo: string;
  merchantCode: string;
  products: Array<Product>;

  //HARDCODED
  storeimage: string = 'https://boygeniusreport.files.wordpress.com/2016/12/amazon-go-store.jpg?quality=98&strip=all&w=782';

  constructor(private activatedRoute: ActivatedRoute, private storeService: StoreService, private utilsService: UtilsService) { }

  ngOnInit() {
    document.getElementById('storeimgdiv').style.backgroundImage = "url('" + this.storeimage + "')";
    document.getElementById('storeimgdiv').style.height = Math.round((screen.height - 100) * 0.5).toString() + 'px';
    document.getElementById('clearingdiv').style.height = Math.round((screen.height - 250) * 0.4).toString() + 'px';
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    this.storeService.fetchStoreDetails(this.merchantCode)
      .then(res => this.fillStoreDetails(res));
  }

  fillStoreDetails(res: any) {
    if(res && res.id) {
      this.storeName = res.displayName;
      if(res.logoURL)
        this.storeLogo = this.utilsService.getDocumentsPrefixURL() + res.logoURL;
      else
        this.storeLogo = this.utilsService.getDefaultStoreImageURL();
    }
  }
}
