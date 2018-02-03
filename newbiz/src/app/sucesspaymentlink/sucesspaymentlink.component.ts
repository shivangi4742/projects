import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-sucesspaymentlink',
  templateUrl: './sucesspaymentlink.component.html',
  styleUrls: ['./sucesspaymentlink.component.css']
})
export class SucesspaymentlinkComponent implements OnInit {

  createPaymentLink: string = '/createpaylink';
  paymentList: string = '/paymentlist';
  dashboard: string = '/dashboard';
  txnId: string;
  url: string;
  isCopied1: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.txnId = this.route.snapshot.params['id'];
    this.url = 'https://merchant.benow.in/ppl/pay/'+this.txnId;
  }

}
