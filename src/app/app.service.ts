import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AppComponentService {

  constructor(private http: HttpClient) { }

  public getUserData(): Observable<Object> {
   return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/UserDetails");
  }

}