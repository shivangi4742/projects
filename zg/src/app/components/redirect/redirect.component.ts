import { Component, OnInit } from '@angular/core';

import { PayRequestModel } from "./../../models/payrequest.model";
import { ZgService } from "./../../services/zg.service";

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  requestUrl: string;
  payrequestmodel: PayRequestModel;

  constructor(
    private zgService: ZgService
  ) { }

  ngOnInit() {
    this.payrequestmodel = this.zgService.getPayRequest();
    console.log('payrequestmodel', this.payrequestmodel);
    this.requestUrl = 'https://merchant.benow.in/paysdk';
    // this.requestUrl = 'http://localhost:9090/paysdk'; 
    // this.submitMe();
  }

  submitMe() {
    let me = this;
    var btn = document.getElementById('submitPaymentForm');

    if (btn) {
      btn.click();
    }
    else
      setTimeout(function () { me.submitMe(); }, 100);
  }

}
