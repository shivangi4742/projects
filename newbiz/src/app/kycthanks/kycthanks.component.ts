import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User, UserService } from 'benowservices';

@Component({
  selector: 'app-kycthanks',
  templateUrl: './kycthanks.component.html',
  styleUrls: ['./kycthanks.component.css']
})
export class KycthanksComponent implements OnInit {
 homeLink: string = '/dashboard';
 user: User;
  constructor(private router:Router,private userService: UserService) { }

  ngOnInit() {
    this.userService.getUser()
      .then(res => this.init(res));
  }

  init(res: User) {
    this.user = res;

  }
  dashboard(){
    this.router.navigateByUrl('/dashboard');
  }
  createpaylink(){
    this.router.navigateByUrl('/createpaylink');
  }

}
