import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-sucesspaymentlink',
  templateUrl: './sucesspaymentlink.component.html',
  styleUrls: ['./sucesspaymentlink.component.css']
})
export class SucesspaymentlinkComponent implements OnInit {

  createPaymentLink: string = '/createpaylink';
  txnId: string;
  url: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.txnId = this.route.snapshot.params['id'];
    this.url = 'https://merchant.benow.in/ppl/pay/'+this.txnId;
  }

}
