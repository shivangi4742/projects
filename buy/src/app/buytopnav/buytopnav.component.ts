import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'buytopnav',
  templateUrl: './buytopnav.component.html',
  styleUrls: ['./buytopnav.component.css']
})
export class BuytopnavComponent implements OnInit {
  numCartItems: number;
  storeHome: string;

  constructor() { }

  ngOnInit() {
  }
}
