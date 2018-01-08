import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-successtest',
  templateUrl: './successtest.component.html',
  styleUrls: ['./successtest.component.css']
})
export class SuccesstestComponent implements OnInit {
  pay :any;
  constructor() { }

  ngOnInit() {
    this.pay = {
      firstname: 'Yatish',
      lastname: 'Gupta',
      amount: 100,
      txnid: 'dsmhfgdsk'
    }
  }
}
