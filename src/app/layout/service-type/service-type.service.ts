import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {

  constructor(private http: HttpClient) { }


  public getAllCountryData(): Observable<Object> {
    //return this.http.get("http://localhost:4200/assets/data/sample-ex/dropDown-data/country-data.json");
    return this.http.get("http://localhost:8081/gcbapi/country");
  }
  public getAllSegmentData(): Observable<Object> {
    //return this.http.get("http://localhost:4200/assets/data/sample-ex/dropDown-data/segment-data.json");
    return this.http.get("http://localhost:8081/gcbapi/product");
  }
  public getBillingBasisData(): Observable<Object> {
    // return this.http.get("http://localhost:4200/assets/data/sample-ex/dropDown-data/billingBasis-data.json");
    return this.http.get("http://localhost:8081/gcbapi/billingBasis");

  }
  public getServicetype(gcbDetailFilters): Observable<Object> {
    // return this.http.get("http://localhost:4200/assets/data/sample-ex/dropDown-data/billingBasis-data.json");
    return this.http.post("http://localhost:8081/gcbapi/serviceType", gcbDetailFilters);

  }

  public getServicetypeData(): Observable<Object> {
    // return this.http.get("http://localhost:4200/assets/data/sample-ex/dropDown-data/billingBasis-data.json");
    return this.http.get("http://localhost:8081/gcbapi/serviceTypeData");

  }

  public upsertServiceType(gcbDetailFilters): Observable<Object> {
    // return this.http.get("http://localhost:4200/assets/data/sample-ex/dropDown-data/billingBasis-data.json");
    return this.http.post("http://localhost:8081/gcbapi/upsertServiceType", gcbDetailFilters);

  }
}
