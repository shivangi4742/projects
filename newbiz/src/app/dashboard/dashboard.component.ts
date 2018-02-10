import { Component, OnInit } from '@angular/core';

import { LocationService } from 'benowservices';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
chargeFee: boolean = false;
  constructor(private locationService: LocationService) { }

  ngOnInit() {
    this.locationService.setLocation('dashboard');
  }
}
