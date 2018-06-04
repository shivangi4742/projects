import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  keepSignedIn: boolean = true;
  mobile: string;
  password: string;
  errorMsg: string;
  hasError: boolean = false;
  // @Input('user') user: User;
  icon: boolean = true;
  icon1: boolean = false;
  isValidMobile: boolean=false;
  otp: string;
  isOtpLogin: boolean=false;
  withpassword: boolean=false;
  withotp:boolean=false;


  constructor() { }

  ngOnInit() {
  }


  getMobile(){

    if(this.mobile.length>0){
      // TODO call service to validate mobile 
      this.isValidMobile = true;
      this.withpassword = true;
    }
  }

  getOtpform(){
    this.withpassword = false;
    this.withotp = true;
    this.isOtpLogin = true;
  }

  getpasswordForm(){
    this.withpassword = true;
    this.withotp = false;
    this.isOtpLogin = false;
  }

  onSubmit(){
    
  }
}
