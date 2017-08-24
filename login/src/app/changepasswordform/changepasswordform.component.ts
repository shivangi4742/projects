import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from 'ng2-translate';

import { User, UtilsService, UserService } from 'benowservices';

@Component({
  selector: 'changepasswordform',
  templateUrl: './changepasswordform.component.html',
  styleUrls: ['./changepasswordform.component.css']
})
export class ChangepasswordformComponent implements OnInit {
  password: string;
  submitErrMsg: string;
  confirmPassword: string;
  verificationCode: string;

  isSentError: boolean = false;
  isSubmitError: boolean = false;
  isSentSuccess: boolean = false;  
  yy: string = 'PASSWORD_FORMAT_ERROR';
  x: string = "New password and confirm password don't match.";
  y: string = "New password and confirm password don't match.";
  xx: string = 'Password has to be of minimum 8 characters. It must have an uppercase, a lowercase, a special character and a number in it.';
  
  @Input('user') user: User;

  constructor(private translate: TranslateService, private router: Router, private utilsService: UtilsService, private userService: UserService) { 
    translate.setDefaultLang('en');    
  }

  ngOnInit() {
    this.translate.onLangChange.subscribe((event: any) => {
        this.translate.getTranslation(this.translate.currentLang)
        .subscribe(res =>  {
            this.x = res[this.y];
            this.xx = res[this.yy];
            this.validatePassword();
        });
    });

    this.translate.getTranslation(this.translate.currentLang)
    .subscribe(res =>  {
        this.x = res[this.y];
        this.xx = res[this.yy];
        this.validatePassword();
    });

    if(!this.user || !this.user.email)
        this.router.navigateByUrl('/login/1');

    this.translate.use(this.utilsService.getLanguageCode(this.user.language));
  }

  resend() {   
    this.isSentError = false;
    this.isSentSuccess = false;
    this.userService.sendVerificationCode(this.user.email)
      .then(res => this.sent(res)); 
  }

  onSubmit() {    
    this.isSubmitError = false;
    this.submitErrMsg = '';
    this.userService.changePassword(this.verificationCode, this.password)
      .then(res => this.changed(res));
  }

  changed(res: any) {
    if(res && res.success == true) 
      this.router.navigateByUrl('/pwdchanged/5');
    else {
      this.isSubmitError = true;
      this.submitErrMsg = res.errorCode;
    }
  }

  sent(res: any) {
    if(res && res.success == true) 
      this.isSentSuccess = true;
    else
      this.isSentError = true;
  }

  validatePassword() {
    if(this.password && this.confirmPassword) {
      var pwd = document.getElementById('password');
      var confirm_password = document.getElementById('confirm');
      if(pwd && confirm_password) {
        this.password = this.password.trim();
        this.confirmPassword = this.confirmPassword.trim();
        (confirm_password as any).setCustomValidity('');
        (pwd as any).setCustomValidity('');
        var reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        if(!reg.test(this.password))
          (pwd as any).setCustomValidity(this.xx);
        else {
          if(this.password != this.confirmPassword)
            (confirm_password as any).setCustomValidity(this.x);
        }
      }
    }
  }

  hasAllRequiredFields() {
      return this.verificationCode && this.verificationCode.trim() && this.password && this.password.trim()
        && this.confirmPassword && this.confirmPassword.trim();
  }
}