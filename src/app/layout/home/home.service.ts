import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HomeService {


  private _product: any;
  private _country: any;
  private _vendor: any;
  private _buyer: any;

  private initialState: object = {
    Product: null,
    ProductServiceType: null,
    Vendor: null,
    VendorConfig: null,
    Buyer: null,
    Ban: null
  }

  state$: Observable<any>;
  private _state$: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this._state$ = new BehaviorSubject(this.initialState);
    this.state$ = this._state$.asObservable();
  }

  public getTreeViewData(): Observable<Object> {
    let product = this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/productTree");
    let country = this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/locationTree");
    let vendor = this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/vendorTree");
    let buyer = this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/buyerTree");

    // Using forkjoin property of observable to get multiple service values based on array values.
    return forkJoin([product, country, vendor, buyer])
      .pipe(
        tap(results => this.setTreeViewData(results)),
        catchError(error => this.handleError(error))
      );
  }

  private setTreeViewData(getTreeViewData: any) {
    this._product = getTreeViewData[0];
    this._country = getTreeViewData[1];
    this._country = getTreeViewData[2];
    this._buyer = getTreeViewData[3];
  }


  private handleError(error) {
    return throwError(error + "UrlConstants.SERVER_ERROR");
  }

  get state() {
    return this._state$.getValue();
  }

  setState(nextState) {
    const { key, data } = nextState;
    this._state$.next({
      ...this.state,
      [key]: data
    })
  }
}