import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {  UtilsService,BusinessCategory, UserService, Businesspro } from 'benowservices';

@Component({
  selector: 'app-mobileno',
  templateUrl: './mobileno.component.html',
  styleUrls: ['./mobileno.component.css']
})
export class MobilenoComponent implements OnInit {
  PhoneNumber: string;
  busi:string;
  busiold:string;
  otp:string;
  id:string;
  register:string;
  errormsg: boolean = false;
  errormsg1: boolean = false;
  errormsg2: boolean = false;
  categry: boolean = false;
  second: boolean = false;
  first: boolean = true;
  businessCategory: BusinessCategory[];
  constructor(private utilsService: UtilsService, private UserService: UserService, private router: Router) { }

  ngOnInit() {
   // this.Updatecategory = new Updatecategory(null, null, null);
   this.register ="https://merchant.benow.in/register";

   this.UserService.getDashboardCategoriesHB()
      .then(bres => this.businessCategory = bres);
  
  }

  onsubmit(){
    this.UserService.checkMerchantt(this.PhoneNumber)
    .then(bres => this.onsubmitpostp(bres));
  }
  onsubmitpostp(res:any) { 
   
    if(res.merchantUser!= null){
   var busin = res.merchantUser;
   this.id= busin.id
   this.busi= busin.category;
   this.busiold=busin.category;
  
     this.UserService.sendOTPforupdate(this.PhoneNumber)
      .then(res => this.onsubmitpost(res));
    }
    else{
      this.errormsg = true;
    }
  }
  
 onsubmitpost(res:any) {
   if(res.responseFromAPI == true) {
      this.second = true;
      this.first=false;
   }
   else {
    this.errormsg2 = true;
  }
 }
 change(){
  this.second = false;
  this.first = true;
  this.categry = false;
  this.errormsg2 = false;
  this.errormsg1 = false;
  this.otp="";
  this.PhoneNumber="";
 }

 onpubmit(){
  this.UserService.verifyOTPforupdate(this.PhoneNumber,this.otp)
  .then(res => this.onpubmitpost(res));
 }

  onpubmitpost(res:any){
  if(res.responseFromAPI == true) {
    this.categry = true;
    this.second = false;
    this.first=false;
  }
  else {
    this.errormsg1 = true;
  }
 }
 updateSubmit(){
   this.UserService.categoryforupdate(this.id, this.busi)
   .then(res => this.updatepost(res));
 }
 updatepost(res){
  var p = res.data 
  if(p.responseFromAPI == true){
    this.router.navigateByUrl("thankyou");
  }
 }
}
