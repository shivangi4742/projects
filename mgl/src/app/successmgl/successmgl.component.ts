import { Component, OnInit } from '@angular/core';

import { MglService} from  '../services/mgl.service';

@Component({
  selector: 'app-successmgl',
  templateUrl: './successmgl.component.html',
  styleUrls: ['./successmgl.component.css']
})
export class SuccessmglComponent implements OnInit {
  pay :any;
  constructor(private mglservice:MglService ) { }

  ngOnInit() {
   this.pay = JSON.parse((document.getElementById('paymentSuccessData') as any).value);

  // will get after successful payment transactionid, actiondata -- getting datastring from the mglurl, consumerno.
   this.mglservice.mgldetailssave(this.pay.txnid,this.pay.udf3, this.pay.udf4);
   console.log('a', this.pay.txnid);  
  }



}
