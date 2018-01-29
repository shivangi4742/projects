import { Component } from '@angular/core';

import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');  
  }

  getMainHeight(): string {
    let h: number = document.getElementById('absoluteMain').offsetHeight;
    if(h < screen.height - 178)
      h = screen.height - 178;

    return h + 'px';
  }
}
