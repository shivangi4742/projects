import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import { TranslateService } from 'ng2-translate';
import { MaterializeAction } from 'angular2-materialize';

import { User, UserService, UtilsService } from 'benowservices';

@Component({
  selector: 'loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css']
})
export class LoginformComponent implements OnInit {
  email: string;
  errorMsg: string;
  password: string;
  modalActions: any = new EventEmitter<string|MaterializeAction>();

  hasError: boolean = false;
  keepSignedIn: boolean = true;

  @Input('user') user: User;

  constructor(private userService: UserService, private utilsService: UtilsService, private translate: TranslateService) { 
    translate.setDefaultLang('en');
  }

  ngOnInit() { 
    this.password = '';
    this.translate.use(this.utilsService.getLanguageCode(this.user.language));   
  }

  onSubmit() {  
    this.userService.signIn(this.email, this.password)
      .then(res => this.signIn(res))     
  }

  signIn(res: any) {        
    if(res && res.success != false) {
      this.user = this.userService.getCurrUser();
      if(res.jwtToken) {
        if(this.user.hasTils) {
          (document as any).title = this.utilsService.getDocTitle(this.user.language, 'benow - merchant console');
          if(this.user.isTilManager) {
            this.userService.setToken(this.keepSignedIn, { 
              token: res.jwtToken, 
              userid: this.user.id,
              username: this.user.email, 
              language: this.user.language ,
              hasTils: this.user.hasTils,
              tilLogin: this.user.tilLogin,
              isTilManager: this.user.isTilManager
            });     
            window.location.href = this.utilsService.getManagerDashboardPageURL();
          }
          else {
            this.user.tilNumber = '';
            this.modalActions.emit({action:"modal",params:['open']});
          }
        }
        else {
          if(this.user.isSuperAdmin) {
            (document as any).title = this.utilsService.getDocTitle(this.user.language, 'benow - admin console');
            this.userService.setToken(this.keepSignedIn, { token: res.jwtToken, username: this.user.email, language: this.user.language, 
              isSuperAdmin: this.user.isSuperAdmin, userid: this.user.id });
              window.location.href = this.utilsService.getAdminDashboardPageURL();
          }
          else {
            if(this.userService.isNGO())
              (document as any).title = this.utilsService.getDocTitle(this.user.language, 'benow - ngo console');
            else
              (document as any).title = this.utilsService.getDocTitle(this.user.language, 'benow - merchant console');

            this.userService.setToken(this.keepSignedIn, { token: res.jwtToken, username: this.user.email, language: this.user.language, 
              lob: this.user.lob, userid: this.user.id });
            if(this.userService.isNGO())
              window.location.href = this.utilsService.getNGODashboardPageURL();
            else
              window.location.href = this.utilsService.getMerchantDashboardPageURL();
          }
        }
      }
      else {
        this.userService.setToken(false, { isUnregistered: true, email: this.user.email, userid: this.user.id, language: this.user.language, 
          lob: this.user.lob, displayName: this.user.displayName, mccCode: this.user.mccCode, merchantCode: this.user.merchantCode,
          mobileNumber: this.user.mobileNumber });
        window.location.href = this.utilsService.getMerchantDashboardPageURL();                   
      }
    }
    else {
      this.password = '';
      this.hasError = true;
      if(res && res.validationErrors && res.validationErrors.login)
        this.errorMsg = res.validationErrors.login;
      else
        this.errorMsg = 'Something went wrong. Please try again.';
    }
  }

  getAllTils() {
    return this.user.allTils;
  }

  copyEmail() {
    this.user.email = this.email;
  }
 
  hasAllRequiredFields() {
      return  this.email && this.email.trim() && this.password && this.password.trim();
  }
}