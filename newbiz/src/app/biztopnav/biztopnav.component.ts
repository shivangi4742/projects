import { Component, OnInit } from '@angular/core';

import { User } from 'benowservices';

@Component({
  selector: 'biztopnav',
  templateUrl: './biztopnav.component.html',
  styleUrls: ['./biztopnav.component.css']
})
export class BiztopnavComponent implements OnInit {
  user: User;

  constructor() { }

  ngOnInit() {
    this.user = new User(false, false, false, false, 0, null, '1', 'dummy@dummy.dummy', 'dummy', 'dummy', 'AL7D6', 'dummy', 'Miyaz Stores',
      '9767843495', null, null, 'HB');
  }

  goHome() {

  }
}
