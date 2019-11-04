import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteDetailsService {

  constructor(private http: HttpClient) { }

  public getAllLocationsByCountry(countryId, locationType): Observable<any> {
    return this.http.get(`${environment.APP_BASE_URL_SERVICE_ENDPOINT}/locations/${countryId}?type=${locationType}`);
  }

}