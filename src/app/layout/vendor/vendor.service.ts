import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {  } from 'rxjs';
import { forkJoin } from 'rxjs';
import { map,delay,catchError,tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VendorService {

  public getVendorDetails():Observable<Object> { 
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/vendor/vendor-details");
  }

  public saveOrUpdateVendor(vendorInsertData): Observable<Object> {
    return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/vendor/vendors", vendorInsertData);
  }

  public getAllHlVendorData(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/vendor/hlvendor-details");
  }
  private handleError(error){
    return throwError(error + "UrlConstants.SERVER_ERROR");
  }


  constructor(private http: HttpClient) { }

 
}