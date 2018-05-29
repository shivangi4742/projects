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

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.url = this.router.url;
    this.txnId = this.route.snapshot.queryParams["q"];

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
