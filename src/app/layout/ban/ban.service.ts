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
export class BanService {

  public getBanDetails():Observable<Object> { 
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/ban/ban-details");
  }

  public getAllCountryCode(): Observable<Object> {
     return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/country");
   }

  public upsertBan(banInsertData): Observable<Object> {
     return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/ban/bans", banInsertData);
   }

  public getAllFocusGroups(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/focusGroup");
  }

  public getServicetypeData(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/serviceTypesData");
  }

  public getVendorConfigDetails():Observable<Object> { 
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/vendorconfig-details");
  }

  public getBuyerDetails():Observable<Object> { 
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/buyer/buyer-details");
  }
  public getVendorServiceType(vendorServiceType):Observable<Object> { 
    return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/fetchServiceType",vendorServiceType);
  }

  private handleError(error){
    return throwError(error + "UrlConstants.SERVER_ERROR");
  }


  constructor(private http: HttpClient) { }

 
}