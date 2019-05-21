import { Observable, of, throwError } from 'rxjs';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
  export class VendorServiceCountryService {
  
    constructor(private http: HttpClient) { }
  
  
    public getAllCountryData(): Observable<Object> {
      return this.http.get("http://localhost:8081/gcbapi/country");
    }

    public getAllProductData(): Observable<Object> {
      //return this.http.get("http://localhost:4200/assets/data/sample-ex/dropDown-data/segment-data.json");
      return this.http.get("http://localhost:8081/gcbapi/product");
    }
    public getBillingBasisData(): Observable<Object> {
      // return this.http.get("http://localhost:4200/assets/data/sample-ex/dropDown-data/billingBasis-data.json");
      return this.http.get("http://localhost:8081/gcbapi/billingBasis");
  
    }
    public getAllServiceType(): Observable<Object> {
        return this.http.get("http://localhost:8081/gcbapi/serviceTypeData");
      }

    public getAllVendorEntity(): Observable<Object> {
        return this.http.get("http://localhost:8081/gcbapi/vendorEntity");
      }

    public getVendorSrCountryData(): Observable<Object> {
        return this.http.get("http://localhost:8081/gcbapi/vendorServiceCountry");
      }
      public upsertVendorServiceCountry(vscObj): Observable<Object> {
        return this.http.post("http://localhost:8081/gcbapi/upsertVendorServiceCountry",vscObj);
      }
      public getServicetype(vscDtoObj): Observable<Object> {
        // return this.http.get("http://localhost:4200/assets/data/sample-ex/dropDown-data/billingBasis-data.json");
        return this.http.post("http://localhost:8081/gcbapi/serviceType", vscDtoObj);
    
      }
    
  }
