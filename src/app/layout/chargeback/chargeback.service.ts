import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ChargebackService {

  constructor(private http: HttpClient) { }


  public getServiceTypeData(productId,vendorId): Observable<Object> {
    return this.http.get("http://localhost:8081/gcbapi/chargeBackServiceType?vendorId="+vendorId+"&productId="+productId);
  }

  public getVendorEntityData(): Observable<Object> {
    return this.http.get("http://localhost:8081/gcbapi/chargeBackVendor");
  }

  public getProductData(vendor): Observable<Object> {
    return this.http.get("http://localhost:8081/gcbapi/chargeBackProduct?vendorId="+vendor);
  }
  public getCostCenter(serviceType): Observable<Object> {
    return this.http.get("http://localhost:8081/gcbapi/chargeBackCostCenter?serviceType="+serviceType);
  }

  public getFocusGroupData(): Observable<Object> {
    return this.http.get("http://localhost:8081/gcbapi/focusGroup");
  }

  public getCurrencyData(): Observable<Object> {
    return this.http.get("http://localhost:8081/gcbapi/currency");
  }

  public getBillingModelData(): Observable<Object> {
    return this.http.get("http://localhost:8081/gcbapi/billingModel");
  }

  public getCountryData(): Observable<Object> {
    return this.http.get("http://localhost:8081/gcbapi/country");
  }

  public getChargeBackData(): Observable<Object> {
    return this.http.get("http://localhost:8081/gcbapi/chargeBack");
  }

 public upsertChargeBack(chargeBackFilters): Observable<Object> {
    return this.http.get("http://localhost:8081/gcbapi/upsertChargeBack",chargeBackFilters);
  }
  
  
}
