import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sodexoresponse',
  templateUrl: './sodexoresponse.component.html',
  styleUrls: ['./sodexoresponse.component.css']
})
export class SodexoresponseComponent implements OnInit {

  isSuccess: boolean;
  url: string;
  txnId: string;
  payLink: string;
  id: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.url = this.router.url;
    this.txnId = this.route.snapshot.queryParams["q"];
    this.id = this.route.snapshot.params['id'];

    if (this.id && this.txnId)
      this.payLink = '/pay/' + this.id;

    if (this.url.indexOf('sodexosuccess') > 0) {
      this.isSuccess = true;
    }
    else {
      this.isSuccess = false;
    }
  }

  ngOnInit() {

  }

}
