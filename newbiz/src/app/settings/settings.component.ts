import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
chargeFee: boolean = false;
name:string;
email:string;
mobilenumber:string;
Password:string;
DisplayName:string;
businessName:string;
BusinessAddress:string;
pincode:string;
PANNumber:string;
accountholdername:string;
accountnumber:string;
conaccountnumber:string;
IFSC:string;
gstno:string;


  constructor() { }

  ngOnInit() {
  }

}
