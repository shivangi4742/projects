import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kycthanks',
  templateUrl: './kycthanks.component.html',
  styleUrls: ['./kycthanks.component.css']
})
export class KycthanksComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  dashboard(){
    this.router.navigateByUrl('/dashboard');
  }

}
