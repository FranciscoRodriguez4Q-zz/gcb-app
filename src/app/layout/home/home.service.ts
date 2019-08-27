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


@Injectable({
  providedIn: 'root'
})
export class HomeService {


    private _product:any;
    private _country: any;
    private _vendor: any;
    private _buyer:any;

  constructor(private http: HttpClient) { }

  public getTreeViewData():Observable<Object> { 
    let product = this.http.get("http://localhost:8080/productTree");
    let country = this.http.get("http://localhost:8080/locationTree");
    let vendor = this.http.get("http://localhost:8080/vendorTree");
    let buyer = this.http.get("http://localhost:8080/buyerTree");
    
    // Using forkjoin property of observable to get multiple service values based on array values.
    return forkJoin([product,country,vendor,buyer])
          .pipe(
            tap(results => this.setTreeViewData(results)),
            catchError(error => this.handleError(error))
          );    
}

private setTreeViewData(getTreeViewData:any){ 
  this._product = getTreeViewData[0];
  this._country = getTreeViewData[1];
  this._country = getTreeViewData[2];
  this._buyer = getTreeViewData[3];
}


private handleError(error){
  return throwError(error + "UrlConstants.SERVER_ERROR");
 }
  
}