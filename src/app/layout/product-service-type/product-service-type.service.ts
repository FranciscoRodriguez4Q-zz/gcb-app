import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductServiceTypeService {

  constructor(private http: HttpClient) { }

  public getProducts(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/product");
  }

  public getBillingBasis(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/billingBasis");
  }

  public getServicetype(gcbDetailFilters): Observable<Object> {
    return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/serviceType", gcbDetailFilters);
  }

  public getServicetypeData(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/serviceTypesData");
  }

  public upsertServiceType(gcbDetailFilters): Observable<Object> {
    return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/serviceTypes", gcbDetailFilters);
  }

  public getBillProcessList(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/billProcess");

  }
}
