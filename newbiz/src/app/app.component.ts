import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs/Subscription';

import { UserService, User, UtilsService, LocationService } from 'benowservices';

import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  subscription: Subscription;
  user: User;
  location: string = 'dashboard';

  constructor(private translate: TranslateService, private router: Router, private userService: UserService, private utilsService: UtilsService,
    private socketService: SocketService, private locationService: LocationService) {
    translate.setDefaultLang('en');  
    let me: any = this; 
    this.subscription = this.locationService.locationChanged().subscribe(message => me.location = message);    
  }

  getMainHeight(): string {
    let h: number = document.getElementById('absoluteMain').offsetHeight;
    if(h < screen.height - 178)
      h = screen.height - 178;

    return h + 'px';
  }

  ngOnInit() { 
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd))
        return;

      window.scrollTo(0, 0)
      if((window as any).ga) {
        (window as any).ga('set', 'page', window.location.href.replace('https://merchant.benow.in/', ''));
        (window as any).ga('send', 'pageview');
      }
    });
    
    this.userService.getUser()
      .then(res => this.init(res));
  }

  loginPolls() {
    if(this.utilsService.getxauth() || this.utilsService.getUnregistered()) {
      let me = this;
      setTimeout(function() { me.loginPolls(); }, 5000);        
    }
    else
      window.location.href = this.utilsService.getLogoutPageURL();  
  }

  init(usr: User) {
    if(usr && usr.id && usr.id.trim().length > 0) {
      this.user = usr;
      //TODO: Login polls, socket implementation, signup & kyc
      this.socketService.joinMerchantRoom(this.user.merchantCode);
       this.userService.checkMerchant(this.user.mobileNumber, "a");          
      this.translate.use(this.utilsService.getLanguageCode(this.user.language));    
      let me = this;
      setTimeout(function() { me.loginPolls(); }, 5000);
    }
    else
      window.location.href = this.utilsService.getLoginPageURL();
  }
  onProfile() { 
    if(window.location.href.indexOf('/dashboard') > 0 )
       return true;
  
    return false;
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
  oncheckkyc() {
  
      if(this.user.registerd ){
         if(!this.user.kycverified) {
          return true;
      }
      return false;
    }
  }
  
}
