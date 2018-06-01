import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SDKService, SDK, UtilsService } from 'benowservices';

@Component({
  selector: 'app-sodexoresponse',
  templateUrl: './sodexoresponse.component.html',
  styleUrls: ['./sodexoresponse.component.css']
})
export class SodexoresponseComponent implements OnInit {

  isSuccess: boolean;
  url: string;
  txnId: string;
  payLink: string;
  id: string;
  pay: SDK;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sdkService: SDKService,
    private utilsService: UtilsService
  ) {

  }

  ngOnInit() {
    this.url = this.router.url;
    this.txnId = this.route.snapshot.queryParams["q"];
    this.id = this.route.snapshot.params['paylink'];

    if (this.id)
      this.payLink = this.utilsService.getBaseURL() + 'ppl/pay/' + this.id;

    this.sdkService.getPaymentLinkDetails(this.id)
      .then(res => this.init(res));

    if (this.url.indexOf('sodexosuccess') > 0) {
      this.isSuccess = true;
    }
    else {
      this.isSuccess = false;
    }
  }


  init(res: SDK) {
    if (res && res.id) {
      this.pay = res;
    }
    else
      this.router.navigateByUrl('/notfound');
  }

  onPayClck() {
    document.location.href = this.payLink;
  }

}
