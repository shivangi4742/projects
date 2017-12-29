import { Component, OnInit } from '@angular/core';

import { MglService } from  '../services/mgl.service';

@Component({
  selector: 'app-successmgl',
  templateUrl: './successmgl.component.html',
  styleUrls: ['./successmgl.component.css']
})
export class SuccessmglComponent implements OnInit {
  pay :any;
  constructor(private mglservice:MglService ) { }

  ngOnInit() {
    if((window as any).fbq) {
      (window as any).fbq('init', '513424812324766'); 
      (window as any).fbq('track', 'Purchase', {value: '0.00', currency: 'USD'});
     }
    this.pay = JSON.parse((document.getElementById('paymentSuccessData') as any).value);
    this.mglservice.mgldetailssave(this.pay.txnid,atob(this.pay.udf2),this.pay.phone,this.pay.udf4);
  }
}
