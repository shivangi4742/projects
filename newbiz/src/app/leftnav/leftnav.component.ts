import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'leftnav',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.css']
})
export class LeftnavComponent implements OnInit {

  createPaymentLink: string = '/createpaylink';
  transactionHistory: string = '/transactionhistory';

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

}
