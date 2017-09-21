import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { PG, SDKService, UtilsService } from 'benowservices';

@Component({
  selector: 'pg',
  templateUrl: './pg.component.html',
  styleUrls: ['./pg.component.css']
})
export class PgComponent implements OnInit {
  id: string;
  udf: string = '';
  processPaymentURL: string;
  pg: PG;
  constructor(private sdkService: SDKService, private route: ActivatedRoute, private router: Router, private utilsService: UtilsService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.pg = this.sdkService.getPG();
    if(this.pg && this.pg.amount > 0) {
      this.processPaymentURL = this.utilsService.getProcessPaymentURL();
      let me: any = this;
      setTimeout(function () { 
        me.submitMe();
      }, 100);
    }
    else
      this.router.navigateByUrl('/notfound');      
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
}
