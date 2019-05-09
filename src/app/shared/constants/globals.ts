import { Injectable, Optional } from '@angular/core';

/* export class UserAttributes {
  role = 'admin';
} */

@Injectable({
  providedIn: 'root',
})
export class Globals {
  public role: string = 'default';

  public sso: string = '999999999';
  /*  constructor(@Optional() config: UserAttributes) {
     if (config) { this.role = config.role; }
   } */
  setRole(role) {
    this.role = role;
  }
  getRole() {
    // Demo: add a suffix if this service has been created more than once

    return this.role;
  }

   
  public hasRoleChanged(): boolean {
    if (this.role === 'default')
      return false;
    else
      return true;

  }
}