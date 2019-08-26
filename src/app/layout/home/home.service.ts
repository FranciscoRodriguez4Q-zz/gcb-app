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

  constructor(private http: HttpClient) { }

  // public getTreeViewData(): Observable<Object> {
  //  // return this.http.get("http://3.209.31.137:8081/gcbapi/getLocationTree");
  //   return this.http.get("http://localhost:8080/gcbapi/billProcess");
  // }

  public getTreeViewData():Observable<Object> { 
    let product = this.http.get("http://localhost:8080/gcbapi/productTree");
    let country = this.http.get("http://localhost:8080/gcbapi/locationTree");
    
    // Using forkjoin property of observable to get multiple service values based on array values.
    return forkJoin([product,country])
          .pipe(
            tap(results => this.setTreeViewData(results)),
            catchError(error => this.handleError(error))
          );    
}

private setTreeViewData(getTreeViewData:any){ 
  this._product = getTreeViewData[0];
  this._country = getTreeViewData[1];
}


private handleError(error){
  return throwError(error + "UrlConstants.SERVER_ERROR");
 }
  
}