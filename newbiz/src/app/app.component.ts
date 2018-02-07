import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { TranslateService } from 'ng2-translate';

import { UserService, User, UtilsService } from 'benowservices';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: User;

  constructor(private translate: TranslateService, private router: Router, private userService: UserService, private utilsService: UtilsService) {
    translate.setDefaultLang('en');  
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

      document.body.scrollTop = 0;
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
      //TODO: socket implementation, signup & kyc
      this.translate.use(this.utilsService.getLanguageCode(this.user.language));    
      let me = this;
      setTimeout(function() { me.loginPolls(); }, 5000);
    }
    else
      window.location.href = this.utilsService.getLoginPageURL();
  }
}
