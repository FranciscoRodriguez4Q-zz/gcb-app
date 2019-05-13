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
      return this.http.get("http://localhost:8080/country");
    }

    public getAllServiceType(): Observable<Object> {
        return this.http.get("http://localhost:8080/serviceTypeData");
      }

    public getAllVendorEntity(): Observable<Object> {
        return this.http.get("http://localhost:8080/vendorEntity");
      }

  }
