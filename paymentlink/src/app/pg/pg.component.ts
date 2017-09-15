import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { SDK, SDKService, UtilsService } from 'benowservices';

@Component({
  selector: 'pg',
  templateUrl: './pg.component.html',
  styleUrls: ['./pg.component.css']
})
export class PgComponent implements OnInit {
  id: string;
  udf: string = '';
  requestUrl: string;
  payrequestmodel: SDK;
  constructor(private sdkService: SDKService, private route: ActivatedRoute, private router: Router, private utilsService: UtilsService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.sdkService.getPaymentLinkDetails(this.id)
      .then(res => this.init(res));
  }

  submitMe() {
    let pgForm: any = <HTMLFormElement>document.getElementById('paymentForm');
    if(pgForm)
      pgForm.submit();
    else {
      let me: any = this;
      setTimeout(function () { 
        me.submitMe();
      }, 100);
    }
  }

  init(res: SDK) {
    if(res && res.id) {
      this.requestUrl = this.utilsService.getSDKURL();
      this.payrequestmodel = res;
      this.payrequestmodel.description = this.payrequestmodel.description ? this.payrequestmodel.description.replace(/\r?\n/g, '').replace(/\n/g, '') : '';
      let me: any = this;
      setTimeout(function () { 
        me.submitMe();
      }, 100);
    }
    else
      this.router.navigateByUrl('/notfound');      
  }
}
