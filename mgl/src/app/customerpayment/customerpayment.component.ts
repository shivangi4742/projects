import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Params, } from '@angular/router';

import { Mgl } from '../models/mgl';
import { Payrequestmodel } from '../models/payrequestmodel';

import { MglService } from '../services/mgl.service';
import { PayrequestService } from '../services/payrequestservice.service';


@Component({
  selector: 'app-customerpayment',
  templateUrl: './customerpayment.component.html',
  styleUrls: ['./customerpayment.component.css']
})
export class CustomerpaymentComponent implements OnInit {
  mgl: Mgl;
  supportModes: string[];
  billno:string;
 // pp:string;
 // ppp:string;
  constructor(private mglservice: MglService, private router: Router,  private payRequestService: PayrequestService) { }
    
  ngOnInit() {
      this.mgl = this.mglservice.getmgldata();
  }

  Submit() {
    if((window as any).fbq) {
     
      (window as any).fbq('track', 'AddPaymentInfo');
     }
   // this.ppp=JSON.stringify(this.mgl.response);
    /* this.mglservice.mgldetailssave(this.mgl.billno, this.ppp, this.mgl.ca, this.mgl.mobno);  
  */
  //console.log(this.mgl.mobno,this.mgl.ca, this.mgl.billno,this.mgl.name);
    this.supportModes = ['UPI'];
    //another option like collect request url
    this.payRequestService.setPayRequest(new Payrequestmodel(2, this.mgl.netpay, false, false, true, true, 'Mahanagar Gas Limited',
      'yo', this.mglservice.getFailedURL(),this.mgl.name, '','', '/assets/mgl/images/0.png', '1', '5499', 'APVY8', '1', 'APVY8@yesbank',
       false, false, false, true, '', this.mgl.mobno, false,false,false,true, this.mglservice.getSuccessURL(), 'Mahanagar Gas Limited', '', '',
     btoa(JSON.stringify(this.mgl.response)), this.mgl.ca,this.mgl.billno, '500000', '', this.supportModes))
      .then(res => this.navigate());
  }

  navigate() {

    this.router.navigateByUrl('/mglpayment');

  }

}
