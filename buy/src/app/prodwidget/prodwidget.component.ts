import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Product, StoreService, UtilsService, ProductService, PaymentlinkService } from 'benowservices';


@Component({
  selector: 'prodwidget',
  templateUrl: './prodwidget.component.html',
  styleUrls: ['./prodwidget.component.css']
})
export class ProdwidgetComponent implements OnInit {
  productLink: string;
  numVariants: number = 0;
  merchantCode: string;
  @Input('product') product: Product;
  orderShipCharge: number;
  freeship: boolean = false;
  chargeperprod: boolean = false;
  chargePerOrder: boolean = false;
  loaded:boolean= false;

  constructor(private activatedRoute: ActivatedRoute, private storeService: StoreService) { }

  ngOnInit() {

    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    if (this.product.merchantCode || this.merchantCode) {
      this.storeService.fetchStoreDetails(this.product.merchantCode)
        .then(res => this.fillStoreDetails(res));
    }

  }
  fillStoreDetails(res) {
    if (res.chargePerOrder) {
      this.chargePerOrder = res.chargePerOrder;
      this.orderShipCharge = res.orderShipCharge;
    }
    if (res.freeShip) {
      this.freeship = true;
    }
    if (res.chargePerProd) {
      this.chargeperprod = true;
    }
    if (this.product) {
      if (window && window.location && window.location.href && window.location.href.toLowerCase().indexOf('/product/') < 0)
        this.productLink = '/' + this.product.merchantCode + '/product/' + this.product.id;
      else
        this.productLink = '/' + this.product.merchantCode + '/product2/' + this.product.id;

      if (this.product.variants && this.product.variants.length > 0)
        this.numVariants = this.product.variants.length;
    }
    this.loaded= true;
  }
}
