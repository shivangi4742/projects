import { Component, Input, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { TranslateService } from 'ng2-translate';
import { MaterializeAction } from 'angular2-materialize';

import { User, UserService, UtilsService, Notification, NotificationService } from 'benowservices';

@Component({
  selector: 'usertopnav',
  templateUrl: './assets/shared/templates/usertopnav.component.html',
  styleUrls: ['./assets/shared/styles/usertopnav.component.css']
})
export class UserTopNavComponent {
  hasTils: boolean;
  isTilManager: boolean;
  language: number;
  name: string|null;
  tmLoad: string;
  notifications: Notification[]|null;
  isNGO: boolean = false;
  hasNotifications: boolean = false;
  numUnreadNotifs: number = 0;
  homeLink: string = '/dashboard';
  modalActions: any = new EventEmitter<string|MaterializeAction>();
  @Input('mtype') mtype: number;
  @Input('user') user: User;

  constructor(private translate: TranslateService, private utilsService: UtilsService, private notificationService: NotificationService,
    private userService: UserService, private router: Router) {  
    translate.setDefaultLang('en');      
  }

  goTo(routeStr: string) {
    
  }

  ngOnInit() {
    this.hasTils = this.user.hasTils;
    this.isTilManager = this.user.isTilManager;
    this.language = this.user.language;
    this.name = this.user.displayName;
    this.isNGO = this.utilsService.isNGO(this.user.mccCode);
    this.tmLoad = this.utilsService.getDateTimeString(new Date());
    if(this.user.isSuperAdmin)
      this.homeLink = '/bnadmin';

    if(window.location.href.indexOf('/notification') < 1)
      this.notificationService.getNotifications(this.user.merchantCode, 1, false, false)
        .then(res => this.fillNotifications(res));

    if(this.language < 1)
      this.language = 1;
  }

  notifModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }

  closeNotifModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }

  fillNotifications(notifs: Notification[]|null) {
    this.notifications = notifs;
    if(this.notifications && this.notifications.length > 0) {
      this.hasNotifications = true;
      this.numUnreadNotifs = this.notifications.length;
    }
  }

  signOut() {
    this.userService.tillRelease(this.user.tilNumber);
    this.utilsService.clearStorages();
    window.location.href = this.utilsService.getLogoutPageURL();
  }

  onTilConsole() {
    if(this.isNGO || this.user.isSuperAdmin)
      return true;

    if(this.hasTils && this.isTilManager && window.location.href.indexOf('/tilconsole') < 1)
      return false;

    return true;
  }

  langChanged(v: any) {    
    this.language = +v;
    this.userService.setUserLanguage(this.language);
    this.utilsService.setLanguageInStorage(this.language);
    this.translate.use(this.utilsService.getLanguageCode(this.language));  
  }

  changePassword() {
    this.utilsService.clearStorages();
    this.userService.resetUser();
    window.location.href = this.utilsService.getChangePasswordPageURL();
  }

  onNotifications(): boolean {
    if(window.location.href.indexOf('/notification/') > 1)
      return true;

    return false;    
  }

  onDashboard(): boolean {
    if(this.user.isSuperAdmin)
      return true;

    if(window.location.href.indexOf('/dashboard') > 1)
      return true;

    if(window.location.href.indexOf('/history') > 1)
      return true;

    if(window.location.href.indexOf('/paymentlink') > 1)
      return true;

    return false;
  }

  onInvices(): boolean {
    if(this.isNGO || this.user.isSuperAdmin)
      return true;

    if(this.hasTils && !this.isTilManager)
      return true;

    if(window.location.href.indexOf('/invoices') > 1)
      return true;

    if(window.location.href.indexOf('/issuepayment') > 1)
      return true;

    if(window.location.href.indexOf('/paymentsummary') > 1)
      return true;

    return false;
  }

  stopBubble(event: any) {    
    event.stopPropagation();
  }
}