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
  CsmNo: string;
  cs:boolean = true;
  errorMsg: string;
  hasError:boolean =false;
  mgl: Mgl;
  constructor(private router: Router, private mglservice:MglService) { }

  ngOnInit() {
    
  }
  
  onSubmit() : void {  
   this.mglservice.getmglDetails(this.CsmNo)
     .then(res => this.mgldet(res))
  }

  mgldet(res:any) {
   
    if(res.ca == '0' && res.status == 'N') {
    this.hasError = true;
    //console.log('gegeg')
    this.errorMsg = "Please enter a valid CA number";
    }
    else{
     this.router.navigateByUrl("/customerpayment");
  }
  }
  
  hasAllRequiredFields() {
    if(this.CsmNo == null){
       this.CsmNo = '';
    }
   var x = this.CsmNo;
   if((x.toString().length)== 12){
    this.cs= false;
   }
   else {
     this.cs= true;
   }
  }
 
  

 }

