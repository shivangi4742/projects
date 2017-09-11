import { Component, Input } from '@angular/core';

import { TranslateService } from 'ng2-translate';

import { Status, UtilsService } from 'benowservices';

@Component({
  selector: 'status',
  templateUrl: './assets/shared/templates/status.component.html',
  styleUrls: ['./assets/shared/styles/status.component.css']
})
export class StatusComponent  {
  @Input('language') language: number;
  @Input('status') status: Status;

  constructor(private translate: TranslateService, private utilsService: UtilsService) { }
}
