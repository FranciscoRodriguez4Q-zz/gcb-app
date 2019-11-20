import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor( private cookieService: CookieService, private router: Router ) { }
 

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

  const cookieExists: boolean = this.cookieService.check('mod_auth_openidc_session');


        if ( cookieExists ) {
             return true;
             //sessionStorage.getItem
         } else {
            this.router.navigate(['/access-denied']);
            return false;
         }
     return true;
  }

  
}
