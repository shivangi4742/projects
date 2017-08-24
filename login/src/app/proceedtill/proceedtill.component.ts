import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import { TranslateService } from 'ng2-translate';
import { MaterializeAction } from 'angular2-materialize';

import { User, UtilsService, UserService } from 'benowservices';

@Component({
  selector: 'proceedtill',
  templateUrl: './proceedtill.component.html',
  styleUrls: ['./proceedtill.component.css']
})
export class ProceedtillComponent implements OnInit {
  errorMsg : string;

  haserror : boolean = false;
  alreadyLoggedIn: boolean = false;
  modalActions: any = new EventEmitter<string|MaterializeAction>();

  @Input('keepSignedIn') keepSignedIn: boolean;
  @Input('tils') tils: String[];
  @Input('user') user: User;

  constructor(translate: TranslateService, private utilsService: UtilsService, private userService: UserService) { }

  ngOnInit() { }

  OnProceed() {
    this.haserror = false;
    this.alreadyLoggedIn = false;
    this.errorMsg = '';
    this.userService.tillAllocate(this.user.tilNumber)
      .then(res => this.init(res));
  }

  forceLogin() {
    this.haserror = false;
    this.alreadyLoggedIn = false;
    this.errorMsg = '';
    this.userService.tillRelease(this.user.tilNumber)
      .then(res => this.released(res));
  }

  released(res: any) {
    if(res && res.responseFromAPI == true)
      this.OnProceed();
    else {
      this.haserror = true; 
      this.errorMsg = this.utilsService.returnGenericError().errMsg;
    }
  }

  reset() {
    this.haserror = false;
    this.alreadyLoggedIn = false;
    this.errorMsg = '';    
  }

  init(res: any) {
    if (res && res.success == false) {
      this.haserror = true; 
      if(res.validationErrors && res.validationErrors['Till ']) {
        this.errorMsg = 'Someone is already logged-in this Til';
        this.alreadyLoggedIn = true;
      }
      else
        this.errorMsg = this.utilsService.returnGenericError().errMsg;
    } 
    else {
      (document as any).title = this.utilsService.getDocTitle(this.user.language, 'benow - merchant console');
      this.userService.setToken(this.keepSignedIn, { 
        token: this.user.token, 
        username: this.user.email, 
        language: this.user.language, 
        hasTils: this.user.hasTils,
        tilLogin: this.user.tilLogin,
        isTilManager: this.user.isTilManager,
        tilNumber: this.user.tilNumber
      });
      this.modalActions.emit({action:"modal",params:['close']});
      //this.router.navigateByUrl('/dashboard');
    }
  }
}