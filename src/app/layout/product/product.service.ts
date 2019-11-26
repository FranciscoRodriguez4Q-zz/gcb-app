import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {  } from 'rxjs';
import { forkJoin } from 'rxjs';
import { map,delay,catchError,tap} from 'rxjs/operators';
import { Product } from './product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  public getBillProcessList(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/billProcess");
  }

  public getUnspsc(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/unspsc");
  }

  public getProductDetails():Observable<any>{
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/product-details");
  }

  public getProductById(productId):Observable<Object>{
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/product/{"+productId+"}");
  }
 public upsertProduct(gcbProductFilters):Observable<any>{
 return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/product", gcbProductFilters);
 }
 
}