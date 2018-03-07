import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-createcampaignurl',
  templateUrl: './createcampaignurl.component.html',
  styleUrls: ['./createcampaignurl.component.css']
})
export class CreatecampaignurlComponent implements OnInit {
  url:string;
  isCopied1: boolean = false;
  constructor() { }

  ngOnInit() {
    this.url= 'https://merchant.benow.in/ppl/buy/PCfwX00000000002/A3S86';
  }

}
