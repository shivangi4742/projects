import { Component, OnInit } from '@angular/core';
import { UtilsService, User, UserService, Status, LocationService } from 'benowservices';

import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.css']
})
export class ChangepassComponent implements OnInit {
  newpass: string;
  confirmnewpass: string;
  oldpass: string;
  user: User;
  passerr: boolean = false;
  passerrmsg: string;
  confpasserr: boolean = false;
  confpasserrmsg: string;
  succmsg:string;
  succ:boolean = false;

  constructor(private translate: TranslateService, private utilsService: UtilsService,
    private userService: UserService, private locationService: LocationService) { }

  ngOnInit() {
    this.locationService.setLocation('changepassword');
  }

  hasAllFields() {
    return this.newpass && this.oldpass && this.confirmnewpass && !this.confpasserr && !this.passerr;
  }

  submit() {
    this.userService.changeoldpassword(this.oldpass.trim(), this.newpass.trim())
      .then(res => this.submitpost(res));
  }

  submitpost(res) {
    if(res.responseFromAPI== true){
      this.succ= true;
      this.succmsg= "password changed successfully";
    } else {
       this.succ = false;
       this.succmsg = "invalid old password";
    }

  }
  newpasswordchecking() {
    this.passwordchecking();
  }
  passwordchecking() {
    if (this.newpass.length < 8 && this.newpass && this.newpass.length > 0) {
      this.passerr = true;
      this.passerrmsg = 'Password must contain at least eight characters!';
      let conf1: any = document.getElementById('newpass');
      if (conf1) {
        conf1.focus();
      }

    }
    else if (this.newpass.trim() == this.oldpass.trim()) {
      this.passerr = true;
      this.passerrmsg = "new password must be different from old password!";
      let conf1: any = document.getElementById('newpass');
      if (conf1) {
        conf1.focus();
      }
    }
    else {
      this.passerr = false;
      this.passerrmsg = '';
    }
  }
  confirmpasswordcheck() {
    if (this.confirmnewpass.length < 8 && this.confirmnewpass.trim() && this.confirmnewpass.length > 0) {
      this.confpasserr = true;
      this.confpasserrmsg = 'Password must contain at least eight characters!';
      let conf: any = document.getElementById('confirmnewpass');
      if (conf) {
        conf.focus();
      }
    }
    else if (this.newpass.trim() != this.confirmnewpass.trim()) {
      this.confpasserr = true;
      this.confpasserrmsg = "Please check that you've entered and confirmed your password!";
      let conf: any = document.getElementById('confirmnewpass');
      if (conf) {
        conf.focus();
      }
    }
    else {
      this.confpasserr = false;
      this.confpasserrmsg = '';

    }
  }
}
