import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SDKService, UtilsService } from "benowservices";
import { PaytmRequestModel } from 'benowservices/models/paytmrequest.model';

@Component({
  selector: 'app-paytmrequest',
  templateUrl: './paytmrequest.component.html',
  styleUrls: ['./paytmrequest.component.css']
})
export class PaytmrequestComponent implements OnInit {

  id: string;

  paytmReq: PaytmRequestModel;
  paytmRequestUrl: string;
  checksum: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sdkService: SDKService,
    private utilService: UtilsService
  ) { }

  ngOnInit() {

    this.id = this.route.snapshot.params['id'];

    this.paytmReq = this.sdkService.getPaytmRequestModel();
    this.paytmRequestUrl = this.utilService.getPaytmPgUrl();

    this.getCheckSum();
  }


  getCheckSum() {
    var paymentModeOnly = '';
    if (this.paytmReq.paymentTypeId == 'CC') {
      paymentModeOnly = 'CREDIT_CARD';
    }
    else if (this.paytmReq.paymentTypeId == 'DC') {
      paymentModeOnly = 'DEBIT_CARD';
    }
    else if (this.paytmReq.paymentTypeId == 'NB') {
      paymentModeOnly = 'NET_BANKING';
    }

    this.sdkService.getPaytmChecksum(this.paytmReq, paymentModeOnly)
      .then(res => this.setChecksum(res));
  }

  setChecksum(res: any): void {
    this.checksum = res.checkSum;
    console.log('checksum', this.checksum);
    console.log('paytmReq', this.paytmReq);
    this.submitMe();
  }

  submitMe() {
    let me = this;
    var btn = document.getElementById("submitButton");

    if (btn && this.checksum) {
      btn.click();
    }
    else
      setTimeout(function () { me.submitMe(); }, 100);
  }


}
