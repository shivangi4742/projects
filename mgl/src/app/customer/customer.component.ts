import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { MglService} from  '../services/mgl.service';


@Component({
  selector: 'customer',
  templateUrl: './customer.component.html',  styleUrls: ['./customer.component.css']
  
})
export class CustomerComponent implements OnInit {
  
  CsmNo: string;


  constructor(private router: Router, private mglservice:MglService) { }

  ngOnInit() {
  }
  

  onSubmit() : void {  
    console.log(this.CsmNo);
   this.mglservice.getmglDetails(this.CsmNo)
     .then(res => this.mgldet(res))
  }

  mgldet(res:any) {
    console.log(res);
     this.router.navigateByUrl("/customerpayment");
  }

 }

