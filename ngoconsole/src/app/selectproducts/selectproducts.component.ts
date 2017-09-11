import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import { User, UtilsService, Product } from 'benowservices';

@Component({
  selector: 'selectproducts',
  templateUrl: './selectproducts.component.html',
  styleUrls: ['./selectproducts.component.css']
})
export class SelectproductsComponent implements OnInit {
  imgErrMsg: string;
  uploadsURL: string;
  products: Array<Product>;
  uploading: boolean = false;
  active: number = 0;
  newProd: Product = new Product(null, null, null, null, null, null, null, null);
  newlyadded: any = { "key": "isNew", "value": true };
  @Input('user') user: User;
  @Input('modalActions') modalActions: any;

  constructor(private utilsService: UtilsService) { 
    this.uploadsURL = utilsService.getUploadsURL();    
  }

  fileChange(e: any) {

  }

  ngOnInit() {
  }

  setActiveTab(tab: number) {

  }

  addProduct() {

  }

  close() {
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }
}
