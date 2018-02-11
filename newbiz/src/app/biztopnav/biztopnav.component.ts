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
  //subscription: Subscription;
  newPayments: Array<Transaction> = new Array<Transaction>();
  name: string;
  tmLoad: string;
  notifications: Notification[];
  isHB: boolean = false;
  isNGO: boolean = false;
  kycverified:boolean = false;
  isUnregistered:boolean = false;
  @Input('language') language: number;
  @Input('user') user: User;

  constructor(private userService: UserService, private utilsService: UtilsService, private translate: TranslateService, 
    private socketService: SocketService) { }

  ngOnInit() {
    this.newPayments = this.socketService.getNewPayments();
    this.language = this.user.language;
    this.name = this.user.displayName;
    this.isHB = this.utilsService.isHB(this.user.merchantCode, this.user.lob);
    this.isNGO = this.utilsService.isNGO(this.user.mccCode);
    this.isUnregistered = this.utilsService.getUnregistered();
    //console.log(this.isUnregistered, this.user, 'helleo');
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
   onregisterteds():boolean {
   // console.log(this.isUnregistered, this.user.registerd, this.user.kycverified);
    if(this.isUnregistered == true ) {
      if(this.user.registerd == false && this.user.kycverified == false) {
        return true;
      } else if(this.user.registerd == true && this.user.kycverified == false) {
        return false;
      }
    }

    return false;
  }

  onregisterte():boolean {
  //  console.log(this.isUnregistered, this.user.registerd, this.user.kycverified);
    if(this.isUnregistered == false && this.user.kycverified == false && this.user.registerd == false && this.isHB )
      return true;

    if(this.isUnregistered == true && this.user.kycverified == false && this.user.registerd == true && this.isHB)
      return true;
   
    return false;
  }


}
