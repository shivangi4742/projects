import { Component, Input, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { TranslateService } from 'ng2-translate';
import { MaterializeAction } from 'angular2-materialize';

import { User, Notification, UserService, UtilsService, NotificationService } from 'benowservices';

@Component({
  selector: 'notifications',
  templateUrl: './assets/shared/templates/notifications.component.html',
  styleUrls: ['./assets/shared/styles/notifications.component.css']
})
export class NotificationsComponent  {
  modalActions: any = new EventEmitter<string|MaterializeAction>();

  @Input('user') user: User;
  @Input('notifications') notifications: Notification[];

  constructor(private translate: TranslateService, private utilsService: UtilsService, private router: Router,
    private notificationService: NotificationService, private userService: UserService) { }

  goToNotification(id: string) {
    this.modalActions.emit({action:"modal",params:['close']});
    this.router.navigateByUrl('/notification/1/' + id);
  }
}