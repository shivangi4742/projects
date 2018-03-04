import { Component, OnInit } from '@angular/core';

import { Product } from 'benowservices';

@Component({
  selector: 'store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  storename: string;
  storeimage: string;
  products: Array<Product>;

  constructor() { }

  ngOnInit() {    
    this.storename = 'Hari Garment Store';
    this.storeimage = 'https://boygeniusreport.files.wordpress.com/2016/12/amazon-go-store.jpg?quality=98&strip=all&w=782';
    var res2 = new Product(false, false, false, 0, 120, 140, '123', '1234', 'test', 'trst', '', 'https://merchant.benow.in/assets/paymentlink/images/donated.png');
    this.products = [res2, res2, res2, res2];

    document.getElementById('storeimgdiv').style.backgroundImage = "url('" + this.storeimage + "')";
  }

}
