import { Component, OnInit } from '@angular/core';

import { TranslateService } from 'ng2-translate';

import { User, UserService, UtilsService } from 'benowservices';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: User;

  constructor(private userService: UserService, private translate: TranslateService, private utilsService: UtilsService) { 
    translate.setDefaultLang('en');
  }

  ngOnInit() { 
    this.userService.getUser()
      .then(res => this.init(res));
  }

  init(usr: User) {
    if(usr && usr.id && usr.id.trim().length > 0) {
      this.user = usr;
      this.translate.use(this.utilsService.getLanguageCode(this.user.language));   
    }
    else
      window.location.href = this.utilsService.getLoginPageURL();
  }
}
