import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User, UserService } from 'benowservices';

@Component({
  selector: 'app-thanksregister',
  templateUrl: './thanksregister.component.html',
  styleUrls: ['./thanksregister.component.css']
})
export class ThanksregisterComponent implements OnInit {
  homeLink: string = '/dashboard';
  user: User;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.getUser()
      .then(res => this.init(res));
  }

  init(res: User) {
    this.user = res;

  }
  removelimit() {
    this.router.navigateByUrl('/kycprocess');
  }
  createpaylink(){
    this.router.navigateByUrl('/createpaylink');
  }
}
