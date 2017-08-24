import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import {TranslateService} from 'ng2-translate';

import { User, UserService } from 'benowservices';

@Component({
  selector: 'verifyform',
  templateUrl: './verifyform.component.html',
  styleUrls: ['./verifyform.component.css']
})
export class VerifyformComponent implements OnInit {
  hasError: boolean = false;
  errorMsg: string = '';

  @Input('user') user: User;

  constructor(translate: TranslateService, private router: Router, private userService: UserService) { }

  ngOnInit() {
  }

  onSubmit() {   
    this.hasError = false;
    this.errorMsg = '';
    this.userService.sendVerificationCode(this.user.email)
      .then(res => this.sent(res))
  }

  sent(res: any) {
    if(res.success == true) 
      this.router.navigateByUrl('/emailed/3');
    else {
      this.hasError = true;
      this.errorMsg = res.errorCode;
    }      
  }
}
