import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VendorConfigService
{
    constructor(private http: HttpClient) { }

    public getAllVendors(): Observable<Object> {
      return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/vendor/vendor-names");
    }

    public getAllCurrencyCode(): Observable<Object> {
        return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/currencyCode");
      }
    
      public getAllCountryCode(): Observable<Object> {
        return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/country");
      }

      public getVendorGridData(): Observable<Object> {
        return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/vendorconfig-details");
      }

      public upsertVendorConfig(vendorConfigDto): Observable<Object> {
        return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/vendorconfig", vendorConfigDto);
      }
      public getAllCurrency(): Observable<Object> {
        return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/currency");
      }
      
}