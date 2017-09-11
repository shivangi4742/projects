import { Component, Input } from '@angular/core';

import { Status } from 'benowservices';

@Component({
  selector: 'status',
  templateUrl: './assets/shared/templates/status.component.html',
  styleUrls: ['./assets/shared/styles/status.component.css']
})
export class StatusComponent  {
  @Input('status') status: Status;

  constructor() { }
}
