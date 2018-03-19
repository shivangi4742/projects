import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import { UtilsService, User, UserService, Payment, Product, Variant, ProductService, StoreService,
   CartService, Size, Status,  Merchant, LocationService, FileService } from 'benowservices';
   
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'app-seeproductdetail',
  templateUrl: './seeproductdetail.component.html',
  styleUrls: ['./seeproductdetail.component.css']
})
export class SeeproductdetailComponent implements OnInit {
 @Input('selPayment') payment: Payment;
 seemodalActions: any = new EventEmitter<string|MaterializeAction>();
  constructor() { }

  ngOnInit() {

  }

  close() {
    console.log('sdjhgjsdgfj')
   this.seemodalActions.emit({ action: "modal", params: ['close'] });
  }

}
