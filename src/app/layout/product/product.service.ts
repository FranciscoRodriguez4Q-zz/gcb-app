import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  public getUnspsc(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/unspsc");
  }

  public getProductDetails(): Observable<any> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/product-details");
  }

  public getProductById(productId): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/product/{" + productId + "}");
  }
  public upsertProduct(gcbProductFilters): Observable<any> {
    return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/product", gcbProductFilters);
  }

}