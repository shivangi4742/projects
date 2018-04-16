import { Component, OnInit } from '@angular/core';

import { PayRequestModel } from "./../../models/payrequest.model";
import { ZgService } from "./../../services/zg.service";
import { UtilsService } from 'benowservices';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  requestUrl: string;
  payrequestmodel: PayRequestModel;

  constructor(
    private zgService: ZgService,
    private utilsservice: UtilsService
  ) { }

  ngOnInit() {
    this.payrequestmodel = this.zgService.getPayRequest();
    this.requestUrl = this.utilsservice.getRequestURL();
    this.submitMe();
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
