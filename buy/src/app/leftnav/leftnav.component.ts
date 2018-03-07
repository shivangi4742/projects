import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'leftnav',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.css']
})
export class LeftnavComponent implements OnInit {
  location: string = 'store';

  constructor() { }

  ngOnInit() {
  }

  goto(loc: string) {

  }
}
