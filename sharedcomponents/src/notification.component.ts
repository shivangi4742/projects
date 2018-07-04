import { Component, Input, EventEmitter } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { TranslateService } from 'ng2-translate';
import { MaterializeAction } from 'angular2-materialize';

import { User, Notification, UserService, UtilsService, NotificationService, FileService } from 'benowservices';

@Component({
  selector: 'notification',
  templateUrl: './assets/shared/templates/notification.component.html',
  styleUrls: ['./assets/shared/styles/notification.component.css']
})
export class NotificationComponent  {
  numUnreadMessages: number;
  numDeletedMessages: number;
  id: string;
  selId: string|null;
  searchTxt: string;
  user: User;
  notifications: Notification[]|null;
  loaded: boolean = false;
  page: number = 1;
  mtype: number = 1;
  active: number = 0;
  numPages: number = 1;
  screenType: number = 3;
  collapsibleActions: any = new EventEmitter<string|MaterializeAction>();

  constructor(private translate: TranslateService, private utilsService: UtilsService, private router: Router, private fileService: FileService,
    private notificationService: NotificationService, private userService: UserService, private route: ActivatedRoute, private sanitizer:DomSanitizer) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.page = this.route.snapshot.params['page'];
    let me = this;
    this.userService.getUser()
      .then(res => this.init(res));
  }

  search() {    
  }

  next() {    
  }

  previous() {
  }

  getFile(res: any) {
  }

  download(url: string) {
    this.fileService.download(url)
      .then(res => this.getFile(res));
  }

  getURL(url: string): string {
    return this.utilsService.getNotificationPrefixURL() + url;
  }

  sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getArrow(id: string): string {
    return this.selId == id ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  setSelected(id: string) {
    if(this.selId == id)
      this.selId = null;
    else
      this.selId = id;
  }

  initNotifs(notifs: Notification[]|null) {
    this.notifications = notifs;
    this.numUnreadMessages = 0;

    this.loaded = true;
    if(this.notifications) {
      this.numUnreadMessages = this.notifications.length;
      let counter: number = -1;
      for(let i = 0; i < this.numUnreadMessages; i++) {
        if(this.notifications[i].id == this.id) {
          counter = i;
          this.selId = this.id;
          break;
        }
      }

      let me = this;
      if(counter >= 0) {
        setTimeout(function() { 
          me.collapsibleActions.emit({action:"collapsible",params:['open',counter]});
        }, 500);
      }
    }
  }

  init(usr: User) {
    if(usr && usr.id) {
        this.user = usr;
        if(this.utilsService.isNGO(this.user.mccCode, this.user.lob))
          this.mtype = 2;
        else if(this.utilsService.isHB(this.user.merchantCode, this.user.lob))
          this.mtype = 3;

        this.notificationService.getNotifications(this.user.merchantCode, this.page, false, false)
            .then(res => this.initNotifs(res));
    }
  }
}