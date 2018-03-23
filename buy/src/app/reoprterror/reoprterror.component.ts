import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilsService, Status, LocationService, CampaignService, StoreService } from 'benowservices';

@Component({
  selector: 'app-reoprterror',
  templateUrl: './reoprterror.component.html',
  styleUrls: ['./reoprterror.component.css']
})
export class ReoprterrorComponent implements OnInit {
  email:string;
  description: string;
  merchantCode: string;
  msg:string;
  err: boolean = false;
  constructor(private CampaignService:CampaignService, private activatedRoute: ActivatedRoute, private storeService: StoreService) { }

  ngOnInit() {
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    this.email='helpdesk@benow.in';
    this.storeService.assignMerchant(this.merchantCode);
  }

  send() {
    this.CampaignService.sendEmail(this.email, this.description,'Report camplain against product','')
     .then(res => this.sendpost(res));
  }
  sendpost(res:any){
   if(res == true){
     this.err= true;
      this.msg="Successfully sent complaint!";
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
