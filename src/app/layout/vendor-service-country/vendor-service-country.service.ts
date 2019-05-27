import { Observable, of, throwError } from 'rxjs';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class VendorServiceCountryService {
  
    constructor(private http: HttpClient) { }
  
  
    public getAllCountryData(): Observable<Object> {
      return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/country");
    }

    public getAllProductData(): Observable<Object> {
      //return this.http.get("http://localhost:4200/assets/data/sample-ex/dropDown-data/segment-data.json");
      return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/product");
    }
    public getBillingBasisData(): Observable<Object> {
      // return this.http.get("http://localhost:4200/assets/data/sample-ex/dropDown-data/billingBasis-data.json");
      return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/billingBasis");
  
    }
    public getAllServiceType(): Observable<Object> {
        return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/serviceTypeData");
      }

    public getAllVendorEntity(): Observable<Object> {
        return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/vendorEntity");
      }

    public getVendorSrCountryData(): Observable<Object> {
        return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/vendorServiceCountry");
      }
      public upsertVendorServiceCountry(vscObj): Observable<Object> {
        return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/upsertVendorServiceCountry",vscObj);
      }
      public getServicetype(vscDtoObj): Observable<Object> {
        // return this.http.get("http://localhost:4200/assets/data/sample-ex/dropDown-data/billingBasis-data.json");
        return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/serviceType", vscDtoObj);
    
      }
      public getVSCountryDWData(colsHeader): Observable<Object> {
        return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/getVSCountryDWData", '');
    
      }
  }
