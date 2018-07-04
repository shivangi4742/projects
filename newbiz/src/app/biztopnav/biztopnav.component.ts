import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from 'ng2-translate';
import { User, UserService, UtilsService, Payment} from 'benowservices';

import { SocketService } from './../socket.service';

@Component({
  selector: 'biztopnav',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './biztopnav.component.html',
  styleUrls: ['./biztopnav.component.css']
})
export class BiztopnavComponent implements OnInit {
  //subscription: Subscription;
  newPayments: Array<Payment> = new Array<Payment>();
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
    private socketService: SocketService,private router: Router) { }

  ngOnInit() {
    this.newPayments = this.socketService.getNewPayments();
    this.language = this.user.language;
    this.name = this.user.displayName;
    this.isHB = this.utilsService.isHB(this.user.merchantCode, this.user.lob);
    this.isNGO = this.utilsService.isNGO(this.user.mccCode, this.user.lob);
    this.isUnregistered = this.utilsService.getUnregistered();
    //console.log(this.isUnregistered, this.user, 'helleo');
  }

  fadeInNewPayments() {
    let me = this;
    let el: any = document.getElementById('dummyIncomingMsgBN');
    if(el) {
      el.style.opacity = 0;
      el.style.display = 'block';
      (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .03) > 1)) {
          el.style.opacity = val;
          requestAnimationFrame(fade);
        }
      })();
    }

    this.utilsService.playAudio();
  }

  fadeOutNewPayments() {
    let el: any = document.getElementById('dummyIncomingMsgBN');
    if(el) {
      el.style.opacity = 1;
      (function fade() {
        if ((el.style.opacity -= .03) < 0) {
          el.style.display = "none";
        } else {
          requestAnimationFrame(fade);
        }
      })();
    }
  }

  removePayment(id: string) {
    if(this.newPayments && this.newPayments.length > 0) {
      let indx: number = this.newPayments.findIndex(p => p.id == id);
      if(indx >= 0)
        this.newPayments.splice(indx, 1);

      if(!(this.newPayments && this.newPayments.length > 0))
        this.fadeOutNewPayments();
    }
    else
      this.fadeOutNewPayments();
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
  oncheckadd() {
    //console.log(this.user.registerd , this.user.kycverified)
    if(!this.user.registerd) {
      if(this.user.kycverified){
        return true;
      }
      return true;
    }
  }

  ting(){
    this.router.navigateByUrl('/registrationprocess')
  }
  changePassword() {
   this.router.navigateByUrl('/changepassword');
  }
  settings() {
    this.router.navigateByUrl('/settings'); 
  }
  
}
