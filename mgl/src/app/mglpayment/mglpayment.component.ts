import { Component, OnInit } from '@angular/core';

import { Mgl } from '../models/mgl';
import { Payrequestmodel } from '../models/payrequestmodel';
import * as $ from 'jquery';
import { MglService } from '../services/mgl.service';
import { PayrequestService } from '../services/payrequestservice.service';
import { UtilsService } from '../../../../sharedservices/src/services/utils.service';



@Component({
  selector: 'app-mglpayment',
  templateUrl: './mglpayment.component.html',
  styleUrls: ['./mglpayment.component.css']
})
export class MglpaymentComponent implements OnInit {
    title = 'Mahanagar Gas payments';
    requestUrl: string;
    payrequestmodel: Payrequestmodel;

    constructor(private payRequestService: PayrequestService, private utilsservice: UtilsService) { }

    ngOnInit(): void {
        this.payrequestmodel = this.payRequestService.getPayRequest();
        this.requestUrl = this.utilsservice.getRequestURL();
   
        this.submitMe();
    }

    /*gotHash(hs: string) {
        this.payrequestmodel.hash = hs;
        console.log('pay request', this.payrequestmodel);
        // this.submitMe();
        let me: any = this;
        setTimeout(function() { console.log('run'); me.submitMe(); }, 2000);
    }*/

    submitMe() {
        let me = this;
        console.log('ppp')
       /* if ($('#submitPaymentForm') && $('#submitPaymentForm')[0])
            $('#submitPaymentForm')[0].click();
        else
            setTimeout(function () { me.submitMe(); }, 100);*/
    }

}

