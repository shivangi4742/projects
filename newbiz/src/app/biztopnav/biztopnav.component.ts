import { Component, OnInit, Input } from '@angular/core';

import { User } from 'benowservices';

@Component({
  selector: 'biztopnav',
  templateUrl: './biztopnav.component.html',
  styleUrls: ['./biztopnav.component.css']
})
export class BiztopnavComponent implements OnInit {
  @Input('user') user: User;

  constructor() { }

  ngOnInit() {
  }
}
