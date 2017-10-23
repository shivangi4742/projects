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
  
  constructor(private mglservice: MglService, private router: Router,  private payRequestService: PayrequestService) { }
    
  ngOnInit() {
      this.mgl = this.mglservice.getmgldata();
  }

  Submit() {
    this.supportModes = ['UPI']; 
    //another option like collect request url
    this.payRequestService.setPayRequest(new Payrequestmodel(2,this.mgl.netpay, false, false, true, true, 'MahaNagar Gas Limited',
      '', this.mglservice.getFailedURL(), this.mgl.name, '','', '', '1', '5499', 'AACH5', '1', 'AACH5@yesbank',
       false, false, false, true, '', this.mgl.ca, false,false,false,false, this.mglservice.getSuccessURL(), 'Benow Sales', '', '',
      this.mgl.response, this.mgl.ca,'', '', '', this.supportModes))
      .then(res => this.navigate());
  }

  navigate() {
   
    this.router.navigateByUrl('/mglpayment');

  }

}
