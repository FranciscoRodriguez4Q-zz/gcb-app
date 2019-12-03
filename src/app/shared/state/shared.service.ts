import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    constructor(private http: HttpClient) { }

    public getBillProcessList(): Observable<any> {
        return this.http.get(`${environment.APP_BASE_URL_SERVICE_ENDPOINT}/billProcess`);
    }

    public getUserData(): Observable<any> {
        return this.http.get(`${environment.APP_BASE_URL_SERVICE_ENDPOINT}/UserDetails`);
    }

    public getCountryData(): Observable<any> {
        return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/country");
    }

}