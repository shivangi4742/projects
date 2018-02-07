import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs/Subscription';

import { User, UserService, UtilsService, Transaction, SocketService } from 'benowservices';

@Component({
  selector: 'biztopnav',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './biztopnav.component.html',
  styleUrls: ['./biztopnav.component.css']
})
export class BiztopnavComponent implements OnInit {
  subscription: Subscription;
  newPayments: Array<Transaction>;
  @Input('language') language: number;
  @Input('user') user: User;

  constructor(private userService: UserService, private utilsService: UtilsService, private translate: TranslateService, 
    private socketService: SocketService) { 
    let me:any  = this;
    this.subscription = this.socketService.receivedPayment().subscribe(message => me.receivedPayment(message));
  }

  ngOnInit() {
    this.socketService.joinMerchantRoom(this.user.merchantCode ? this.user.merchantCode : '', this.user.tilNumber);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  receivedPayment(res: any) {
    if (res && res.data && res.out == true) {
      let me: any = this;
      this.newPayments.push(new Transaction(false, res.data.amount, null, null, res.data.id, res.data.tr, res.data.mode, res.data.vpa, res.data.till, 
        null, res.data.dt, null, null, null));
      if(this.newPayments.length <= 1) {
        setTimeout(function() { me.fadeInNewPayments(); }, 500);
        setTimeout(function() { me.removePayment(res.data.id); }, 3500);
      }
      else {
        this.utilsService.playAudio();
        setTimeout(function() { me.removePayment(res.data.id); }, 3000);            
      }
    }
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
