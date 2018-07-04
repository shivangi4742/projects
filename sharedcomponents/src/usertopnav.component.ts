import { Component, Input, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { MaterializeAction } from 'angular2-materialize';

import { User, UserService, UtilsService, Notification, NotificationService, SocketService, Payment } from 'benowservices';

@Component({
  selector: 'usertopnav',
  templateUrl: './assets/shared/templates/usertopnav.component.html',
  styleUrls: ['./assets/shared/styles/usertopnav.component.css']
})
export class UserTopNavComponent {
  hasTils: boolean;
  isTilManager: boolean;
  language: number;
  lastSwipe: number;
  name: string|null;
  tmLoad: string;
  notifications: Notification[]|null;
  subscription: Subscription;
  isNGO: boolean = false;
  plUserAction: boolean = false;
  esUserAction: boolean = false;
  plProceeding: boolean = false;
  estallProceeding: boolean = false;
  isPolling: boolean = false;
  isUnregistered: boolean = false;
  hasNotifications: boolean = false;
  notifInitialized: boolean = false;
  plx: number = -1;
  plSlide: number = 1;
  lastPLSlide: number = -1;
  plx1: number = -1;
  estallSlide: number = 1;
  lastestallSlide: number = -1;
  numUnreadNotifs: number = 0;
  catalogURL: string = '/catalog';
  homeLink: string = '/dashboard';
  campaignURL: string = '/newestall';
  newPayments: Array<Payment> = new Array<Payment>();
  notifModalActions: any = new EventEmitter<string|MaterializeAction>();
  tourModal1Actions: any = new EventEmitter<string|MaterializeAction>();
  tourModal2Actions: any = new EventEmitter<string|MaterializeAction>();
  tourModal3Actions: any = new EventEmitter<string|MaterializeAction>();
  @Input('mtype') mtype: number;
  @Input('user') user: User;

  constructor(private translate: TranslateService, private utilsService: UtilsService, private notificationService: NotificationService,
    private userService: UserService, private router: Router, private socketService: SocketService) {  
    translate.setDefaultLang('en');      
    let me: any = this;
    this.subscription = this.socketService.receivedPayment().subscribe(message => me.receivedPayment(message));
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
      this.newPayments.push(new Payment(false, res.data.amount, null, null, res.data.id, res.data.tr, res.data.mode, res.data.vpa, res.data.till,
        null, res.data.dt, null, null, false, null, null, null, null, null, null, null, null, null, null));
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

  goTo(routeStr: string) {    
    switch(routeStr) {
      case 'settings':
        window.location.href = this.utilsService.getProfilePageURL();
        break;
      case 'tilconsole':
        window.location.href = this.utilsService.getTilConsoleURL();
        break;
      case 'invoices':
        window.location.href = this.utilsService.getInvoicesPageURL();
        break;
      default:
        break;
    }
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
    if(this.user.lob && this.user.lob.toUpperCase() == 'NHB') {
      if(window.location.href.indexOf('/mybiz/') > 0)
        window.location.href = window.location.href.replace('/mybiz/', '/newbiz/');
      else
        window.location.href = this.utilsService.getNewBizURL();
    }

    this.hasTils = this.user.hasTils;
    this.isTilManager = this.user.isTilManager;
    this.language = this.user.language;
    this.name = this.user.displayName;
    this.isNGO = this.utilsService.isNGO(this.user.mccCode, this.user.lob);
    this.tmLoad = this.utilsService.getDateTimeString(new Date());
    this.isUnregistered = this.utilsService.getUnregistered();
    let me = this;    
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

    this.socketService.joinMerchantRoom(this.user.merchantCode ? this.user.merchantCode : '', this.user.tilNumber);
  }

  plSwipeStart(event: any) {
    this.plUserAction = true;
    if(event && event.target && event.target.id == 'createplinkbtn')
      this.createplink();
    else {
      let swt: number = Date.now();
      if(this.lastSwipe) {
        if(swt - this.lastSwipe < 800) {
          this.lastSwipe = swt;
          return;
        }
      }

      this.lastSwipe = swt;
      this.plx = -1;
      if(event && event.changedTouches && event.changedTouches[0] && event.changedTouches[0].pageX >= 0)
        this.plx = event.changedTouches[0].pageX;
      else if(event && event.screenX >= 0)
        this.plx = event.screenX;
      else if(event && event.pageX >= 0)
        this.plx = event.pageX;
      else if(event && event.x >= 0)
        this.plx = event.x;
    }
  }

  plSwipeEnd(event: any) {
    let newplx: number = -1;
    if(this.plx >= 0 && event && event.changedTouches && event.changedTouches[0] && event.changedTouches[0].pageX >= 0)
      newplx = event.changedTouches[0].pageX;
    else if(this.plx >= 0 && event && event.screenX >= 0)
      newplx = event.screenX;
    else if(this.plx >= 0 && event && event.pageX >= 0)
      newplx = event.pageX;
    else if(this.plx >= 0 && event && event.x >= 0)
      newplx = event.x;

    if(newplx >= 0) {
      if(newplx >= this.plx + 10)
        this.plRight();
      else
        this.plLeft();

      this.plx = -1;
    }
  }

  plLeft() {
    if(this.plSlide < 4)
      ++this.plSlide;
  }

  plRight() {
    if(this.plSlide > 1)
      --this.plSlide;
  }

  estallSwipeStart(event: any) {
    this.esUserAction = true;
    if(event && event.target && event.target.id == 'createestallbtn')
      this.createstall();
    else {
      let swt: number = Date.now();
      if(this.lastSwipe) {
        if(swt - this.lastSwipe < 800) {
          this.lastSwipe = swt;
          return;
        }
      }

      this.lastSwipe = swt;
      this.plx1 = -1;
      if(event && event.changedTouches && event.changedTouches[0] && event.changedTouches[0].pageX >= 0)
        this.plx1 = event.changedTouches[0].pageX;
      else if(event && event.screenX >= 0)
        this.plx1 = event.screenX;
      else if(event && event.pageX >= 0)
        this.plx1 = event.pageX;
      else if(event && event.x >= 0)
        this.plx1 = event.x;
    }
  }

  estallSwipeEnd(event: any) {
    let newplx1: number = -1;
    if(this.plx1 >= 0 && event && event.changedTouches && event.changedTouches[0] && event.changedTouches[0].pageX >= 0)
      newplx1 = event.changedTouches[0].pageX;
    else if(this.plx1 >= 0 && event && event.screenX >= 0)
      newplx1 = event.screenX;
    else if(this.plx1 >= 0 && event && event.pageX >= 0)
      newplx1 = event.pageX;
    else if(this.plx1 >= 0 && event && event.x >= 0)
      newplx1 = event.x;

    if(newplx1 >= 0) {
      if(newplx1 >= this.plx1 + 10)
        this.estallRight();
      else
        this.estallLeft();

      this.plx1 = -1;
    }
  }

  estallLeft() {
    if(this.estallSlide < 5)
      ++this.estallSlide;
  }

  estallRight() {
    if(this.estallSlide > 1)
      --this.estallSlide;
  }

  createstall() {
    this.tourModal1Actions.emit({action:"modal",params:['close']});    
    this.tourModal2Actions.emit({action:"modal",params:['close']});    
    this.tourModal3Actions.emit({action:"modal",params:['close']});    
    this.router.navigateByUrl(this.campaignURL);          
  }

  createplink() {
    window.location.href = this.utilsService.getPaymentLinkPageURL();
  }

  mainModal() {
    this.tourModal3Actions.emit({action:"modal",params:['open']});    
  }

  estall() {
    let me: any = this;
    this.estallSlide = 1;
    this.tourModal2Actions.emit({action:"modal",params:['open']});
    if(!this.estallProceeding) {
      this.estallProceeding = true;
      setTimeout(function() { me.proceedestall(); }, 2000);
    }
  }

  proceedestall() {
    if(!this.esUserAction) {
      if(this.lastestallSlide >= 1 && this.lastestallSlide == this.estallSlide) {
        if(this.estallSlide < 5)
          this.estallLeft();
      }
      else
        this.lastestallSlide = this.estallSlide;

      let me: any = this;
      setTimeout(function() { me.proceedestall(); }, 2000);
    }
  }

  proceed() {
    if(!this.plUserAction) {
      if(this.lastPLSlide >= 1 && this.lastPLSlide == this.plSlide) {
        if(this.plSlide < 4)
          this.plLeft();
      }
      else
        this.lastPLSlide = this.plSlide;

      let me: any = this;
      setTimeout(function() { me.proceed(); }, 2000);
  }
  }

  sms() {
    let me: any = this;
    this.plSlide = 1;
    this.tourModal1Actions.emit({action:"modal",params:['open']});
    if(!this.plProceeding) {
      this.plProceeding = true;
      setTimeout(function() { me.proceed(); }, 2000);
    }
  }

  esSelect(sl: number) {
    if(this.estallSlide != sl) {
      this.estallSlide = sl;
      this.esUserAction = true;
    }
  }

  plSelect(sl: number) {
    if(this.plSlide != sl) {
      this.plSlide = sl;
      this.plUserAction = true;
    }
  }

  onProfile() {
    if(this.user.isSuperMerchant || this.user.isSuperAdmin)
      return true;

    return false;
  }

  notifModal() {
    this.notifModalActions.emit({action:"modal",params:['open']});
  }

  closeNotifModal() {
    this.notifModalActions.emit({action:"modal",params:['close']});
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