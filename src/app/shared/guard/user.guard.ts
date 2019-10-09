import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Globals } from '../constants/globals';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(private router: Router,private globals: Globals) {}

    canActivate() { 
       var role =this.globals.role;
       if (role ==='Admin') {
           console.log('in user guard role :',role);
            return true;

        } else {
           this.router.navigate(['/access-denied']);
           return false;
        } 

        
    }
}
