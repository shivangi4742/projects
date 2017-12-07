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
  isPolling: boolean = false;
  isUnregistered: boolean = false;
  hasNotifications: boolean = false;
  notifInitialized: boolean = false;
  numUnreadNotifs: number = 0;
  catalogURL: string = '/catalog';
  homeLink: string = '/dashboard';
  campaignURL: string = '/newestall';
  modalActions: any = new EventEmitter<string|MaterializeAction>();
  @Input('mtype') mtype: number;
  @Input('user') user: User;

  constructor(private translate: TranslateService, private utilsService: UtilsService, private notificationService: NotificationService,
    private userService: UserService, private router: Router) {  
    translate.setDefaultLang('en');      
  }

  goTo(routeStr: string) {    
  }

  hasCampaign(): boolean {
    if(window.location.href.indexOf('campaign') > 1 || window.location.href.indexOf('estall') > 1)
      return false;

    return this.mtype > 1;    
  }

  hasCatalog(): boolean {
    if(window.location.href.indexOf('/catalog') > 1 || window.location.href.indexOf('/donationoptions') > 1)
      return false;

    return this.mtype > 1;
  }

  init() {
    if(!this.notifInitialized)
      this.notificationService.getNotifications(this.user.merchantCode, 1, false, false)
        .then(res => this.fillNotifications(res));
  }

  loginPolls() {
    if(this.utilsService.getxauth() || this.utilsService.getUnregistered()) {
      let me = this;
      setTimeout(function() { me.loginPolls(); }, 5000);        
    }
    else
      window.location.href = this.utilsService.getLogoutPageURL();
  }

  ngOnInit() {
    this.hasTils = this.user.hasTils;
    this.isTilManager = this.user.isTilManager;
    this.language = this.user.language;
    this.name = this.user.displayName;
    this.isNGO = this.utilsService.isNGO(this.user.mccCode);
    this.tmLoad = this.utilsService.getDateTimeString(new Date());
    this.isUnregistered = this.utilsService.getUnregistered();
    let me = this;

    setTimeout(function() { var md3 = document.getElementById("modl3");(md3 as any).click(); }, 1000);
    
    if(!this.isPolling)
      setTimeout(function() { me.loginPolls(); }, 5000);

    if(this.name && this.name.length > 15)
      this.name = this.name.substring(0, 14) + '...';

    if(window.location.href.indexOf('/notification') < 1)
      this.notificationService.getNotifications(this.user.merchantCode, 1, false, false)
        .then(res => this.fillNotifications(res));
 
    if(this.mtype == 2) {
      this.campaignURL = '/newcampaign';      
      this.catalogURL = '/donationoptions';
    }

    if(this.language < 1)
      this.language = 1;
  }

  estall() {
    var md1 = document.getElementById("modl1");
    (md1 as any).click();
  }

  sms() {
    var md2 = document.getElementById("modl2");
    (md2 as any).click();
  }


  notifModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }

  closeNotifModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }

  fillNotifications(notifs: Notification[]|null) {
    this.notifInitialized = true;
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
    if(this.isNGO || this.user.isSuperAdmin || this.utilsService.isHB(this.user.merchantCode, this.user.lob))
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

  goHome() {
    window.location.href = this.utilsService.getOldDashboardURL();
  }
}