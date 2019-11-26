import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Globals } from 'src/app/shared/constants/globals';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  pushRightClass: string = 'push-right';
  cookieExists : boolean = true;
  headText: String = "";

  constructor(private translate: TranslateService,public router: Router,private http: HttpClient,
    private cookieService: CookieService, private globals: Globals) {
    this.headText = this.globals.firstName+" "+this.globals.lastName+" - "+this.globals.sso;
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');

    this.router.events.subscribe(val => {
        if (
            val instanceof NavigationEnd &&
            window.innerWidth <= 992 &&
            this.isToggled()
        ) {
            this.toggleSidebar();
        }
    }); }

  ngOnInit() {
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
}

toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
}

rltAndLtr() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('rtl');
}

onLoggedout() {
 //   localStorage.removeItem('isLoggedin');
 this.cookieExists = this.cookieService.check('mod_auth_openidc_session');

 if( this.cookieExists )
  {
       this.cookieService.delete('mod_auth_openidc_session');

       //cookieService.deleteAll();
}

 console.log("calling this ");
this.http.get("https://ssologin.ssogen2.corporate.ge.com/logoff/logoff.jsp")
.subscribe(
    refData => {
    
        console.log("refdata sso ", refData );

    },
    error => {
    });
}

changeLang(language: string) {
    this.translate.use(language);
}
}
