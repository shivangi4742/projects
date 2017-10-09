import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Params, } from '@angular/router';

import { Mgl } from '../models/mgl';
import { Payrequestmodel } from '../models/payrequestmodel';

import { MglService } from '../services/mgl.service';
import { PayrequestService } from '../services/payrequestservice.service';
import { UtilsService } from '../../../../sharedservices/src/services/utils.service';

@Component({
  selector: 'app-customerpayment',
  templateUrl: './customerpayment.component.html',
  styleUrls: ['./customerpayment.component.css']
})
export class CustomerpaymentComponent implements OnInit {
  mgl: Mgl;
  supportModes: string[];
  constructor(private mglservice: MglService, private router: Router, private utilsservice: UtilsService, 
  private payRequestService: PayrequestService) { }

  ngOnInit() {

   
      this.mgl = this.mglservice.getmgldata();
      console.log('hello', this.mgl.billdt)

  }

  Submit() {
     console.log('helgo')
    this.payRequestService.setPayRequest(new Payrequestmodel(2, '1', true,true, true, true, 'shihi',
      'shgdh', this.utilsservice.getFailedURL(), 'ertyu', 'ghvbjn', 'fcghbn', 'dfcb', '1', '5499', 'AACH5', '1', 'AACH5@yesbank',
       false, true, true,  true, '', '', false,false,false,false, this.utilsservice.getSuccessURL(), 'Benow Sales', 'df', '',
      '', '','', '', '', this.supportModes))
      .then(res => this.navigate());
  }

  navigate() {
    console.log('helo')
    this.router.navigateByUrl('/mglpayment');

  }

}
