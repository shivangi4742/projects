import { Component, OnInit } from '@angular/core';
import { UtilsService, Status, LocationService, CampaignService } from 'benowservices';

@Component({
  selector: 'app-reoprterror',
  templateUrl: './reoprterror.component.html',
  styleUrls: ['./reoprterror.component.css']
})
export class ReoprterrorComponent implements OnInit {
  email:string;
  description: string;
  msg:string;
  err: boolean = false;
  constructor(private CampaignService:CampaignService) { }

  ngOnInit() {
    this.email='helpdesk@benow.in';
  }

  send() {
    this.CampaignService.sendEmail(this.email, this.description,'Report camplain against product','')
     .then(res => this.sendpost(res));
  }
  sendpost(res:any){
   if(res== true){
     this.err= true;
      this.msg="successfully complain sent!";
   }
   else {
     this.err= true;
     this.msg = "Something went wrong!";
   }
  }
  hasrequired(){
    return this.description && this.email;
  }
}
