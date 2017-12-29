import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { MglService} from  '../services/mgl.service';
import { Mgl } from '../models/mgl';


@Component({
  selector: 'customer',
  templateUrl: './customer.component.html',  
  styleUrls: ['./customer.component.css']
  
})
export class CustomerComponent implements OnInit {
  CsmNo: string = '';
 
  mobno:string;
  errorMsg : string;
  erroMsg: string;
  hasError : boolean = false;
  hasErro : boolean = false;
  mgl: Mgl;
  tid:string;
  constructor(private router: Router, private mglservice:MglService) { }

  ngOnInit() {
    if((window as any).fbq){
    
      (window as any).fbq('track', 'PageView');
     }
  }
  
  onSubmit() : void {  
   this.mglservice.getmglDetails(this.CsmNo, this.mobno)
     .then(res => this.mgldet(res))
  
  }

  mgldet(res:any) {
   
    if(res.status== 'Y') {
    this.mglservice.checkPaymentPreActionData("MahaNagar Gas", res.billno)
       .then(res => this.mgldett(res));
    }
    else if(res.ca == '0' && res.status == 'N') {
    this.hasError = true;
    this.hasErro = false;
    this.errorMsg = "Please enter a valid CA number";
    } 
    else {
     this.router.navigateByUrl("/customer");
  }
}
mgldett(res:any) {
 var pp = JSON.parse(res._body);
 var t = pp.data;

 if(t.responseFromAPI==true){
  if((window as any).fbq) {
    (window as any).fbq('init', '513424812324766'); 
    (window as any).fbq('track', 'InitiateCheckout');
   }
       this.router.navigateByUrl("/customerpayment");
 } else {
  
   this.hasError = false;
   this.hasErro = true;
   this.erroMsg = "You have already paid this month's bill!" 
   this.tid = t.transactionRef;
 }


}
  
  hasAllRequiredFields() {
    if(this.CsmNo == null) {
       this.CsmNo = '';
    }
   var x = this.CsmNo;
   if((x.toString().length)== 12 && this.mobno) {
     return false;
   }
   else {
     return true;
    }
  }
 }

