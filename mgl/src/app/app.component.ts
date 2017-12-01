import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) { }

  ngOnInit() { 
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd))
        return;

      document.body.scrollTop = 0;
      if((window as any).ga) {
        (window as any).ga('set', 'page', window.location.href.replace('https://merchant.benow.in/', ''));
        (window as any).ga('send', 'pageview');
      }
    });
  }
}
