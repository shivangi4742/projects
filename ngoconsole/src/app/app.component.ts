import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { TranslateService } from 'ng2-translate';

import { User, UserService, UtilsService } from 'benowservices';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: User;
  mtype: number = 2;

  constructor(private userService: UserService, private translate: TranslateService, private utilsService: UtilsService, private router: Router) { 
    translate.setDefaultLang('en');
  }

  startAudio() {
    this.utilsService.startAudio();
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

  init(usr: User) {
    if(usr && usr.id && usr.id.trim().length > 0) {
      if(this.utilsService.isHB(usr.merchantCode, usr.lob))
        this.mtype = 3;
      
      this.user = usr;
      this.translate.use(this.utilsService.getLanguageCode(this.user.language));   
    }
    else
      window.location.href = this.utilsService.getLoginPageURL();
  }
}
