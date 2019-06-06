import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor( private cookieService: CookieService ) { }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

  const cookieExists: boolean = this.cookieService.check('mod_auth_openidc');


        if ( cookieExists ) {
             return true;
             //sessionStorage.getItem
         } else {
            //this.router.navigate(['/access-denied']);
            return false;
         }
     return true;
  }

  
}
