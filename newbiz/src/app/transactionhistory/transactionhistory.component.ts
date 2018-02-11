import { Component, OnInit } from '@angular/core';

import { LocationService } from 'benowservices';

@Component({
  selector: 'app-transactionhistory',
  templateUrl: './transactionhistory.component.html',
  styleUrls: ['./transactionhistory.component.css']
})
export class TransactionhistoryComponent implements OnInit {

  dashboard: string = '/dashboard';
  searchText: string;

  constructor(private locationService: LocationService) { }

  ngOnInit() {
    this.locationService.setLocation('transactionhistory');
  }

}
