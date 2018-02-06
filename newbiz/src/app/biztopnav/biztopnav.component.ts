import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { TranslateService } from 'ng2-translate';

import { User, UserService, UtilsService, Transaction } from 'benowservices';

import { SocketService } from './../socket.service';

@Component({
  selector: 'biztopnav',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './biztopnav.component.html',
  styleUrls: ['./biztopnav.component.css']
})
export class BiztopnavComponent implements OnInit {
  newPayments: Array<Transaction>;

  @Input('language') language: number;
  @Input('user') user: User;

  constructor(private userService: UserService, private utilsService: UtilsService, private translate: TranslateService, 
    private socketService: SocketService) { }

  ngOnInit() {
    this.newPayments = this.socketService.getNewPayments();
  }

  langChanged(e: any) {
    this.language = +e;
    this.userService.setUserLanguage(this.language);
    this.utilsService.setLanguageInStorage(this.language);
    this.translate.use(this.utilsService.getLanguageCode(this.language));      
  }

  signOut() {
    this.utilsService.clearStorages();
    this.userService.resetUser();
    window.location.href = this.utilsService.getLogoutPageURL();
  }

  changePassword() {
    this.utilsService.clearStorages();
    this.userService.resetUser();
    window.location.href = this.utilsService.getChangePasswordPageURL();    
  }
}
