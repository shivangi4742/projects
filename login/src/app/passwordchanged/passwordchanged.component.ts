import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from 'ng2-translate';

import { User } from 'benowservices';

@Component({
  selector: 'passwordchanged',
  templateUrl: './passwordchanged.component.html',
  styleUrls: ['./passwordchanged.component.css']
})
export class PasswordchangedComponent implements OnInit {
  @Input('user') user: User;

  constructor(translate: TranslateService, private router: Router) { }

  ngOnInit() {
    if(!this.user || !this.user.email)
        this.router.navigateByUrl('/login/1');
  }
}
