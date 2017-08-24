import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import {TranslateService} from 'ng2-translate';

import { User } from 'benowservices';

@Component({
  selector: 'emailed',
  templateUrl: './emailed.component.html',
  styleUrls: ['./emailed.component.css']
})
export class EmailedComponent implements OnInit {
  @Input('user') user: User;

  constructor(private router: Router, translate: TranslateService) { }

  ngOnInit() {
    if(!this.user || !this.user.email)
        this.router.navigateByUrl('/login/1');
  }
}
