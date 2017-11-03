import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { TranslateService } from 'ng2-translate';

import { User, UserService, UtilsService } from 'benowservices';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  status: number;
  user: User;

   constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute, private userService: UserService,
    private utilsService: UtilsService) { 
    translate.setDefaultLang('en');    
  } 

  ngOnInit() {
    this.status = this.route.snapshot.params['status'];
    if(!this.status || this.status < 1)
      this.status = 1;

    if(this.status == 6 || window.location.href.indexOf('/logout') > 1) {
      this.utilsService.clearStorages();
      let u = this.userService.getCurrUser();
      if(u && u.email)
        window.location.reload();
      else
        this.router.navigateByUrl('/login/1');
    }
    else {
      this.userService.getUser()
        .then(res => this.init(res));
    } 
  }

  langChanged(v: any) {
    this.user.language = +v;
    this.userService.setUserLanguage(this.user.language);
    (document as any).title = this.utilsService.getDocTitle(this.user.language, 'Benow - Get UPI/BHIM Enabled Now');
    this.translate.use(this.utilsService.getLanguageCode(this.user.language));
  }

  private init(usr: User) {
    if(usr && usr.id) {
      if(usr.isSuperAdmin)
        window.location.href = this.utilsService.getAdminDashboardPageURL();
      else if(this.utilsService.isNGO(usr.mccCode))
          window.location.href = this.utilsService.getNGODashboardPageURL();
      else if(this.utilsService.isHB(usr.merchantCode))
        window.location.href = this.utilsService.getMyBizDashboardPageURL();
      else if(usr.hasTils && usr.isTilManager)
        window.location.href = this.utilsService.getManagerDashboardPageURL();
      else
        window.location.href = this.utilsService.getMerchantDashboardPageURL();
    }
    else {
      this.user = usr;
      this.translate.use(this.utilsService.getLanguageCode(this.user.language));
    } 
  }
}
