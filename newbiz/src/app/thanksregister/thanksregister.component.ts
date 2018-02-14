import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thanksregister',
  templateUrl: './thanksregister.component.html',
  styleUrls: ['./thanksregister.component.css']
})
export class ThanksregisterComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  removelimit(){
    this.router.navigateByUrl('/kycprocess');
  }
}
