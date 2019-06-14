import { Injectable } from '@angular/core';
import { Observable, of, throwError,forkJoin } from 'rxjs';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map,delay,catchError,tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ChargebackService {  
  
  //This will store the reference data values.
  private _vendorData:any;
  private _serviceTypeData: any;
  private _legalEntityData:any;
  private _focusGroupData: any;

  constructor(private http: HttpClient) { }

  
  public getServiceTypeData(productId,vendorId): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/chargeBackServiceType?vendorId="+vendorId+"&productId="+productId);
  }

  public getVendorEntityData(productId): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/chargeBackVendor?productId="+productId);
  }

  public getProductData(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/chargeBackProduct");
  }
  public getCostCenter(serviceType,productId,vendorId): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + 
      "/chargeBackCostCenter?serviceType="+serviceType+
      "&productId="+productId+"&vendorId="+vendorId);
  }

  public getFocusGroupData(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/focusGroup");
  }

  public getCurrencyData(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/currency");
  }

  public getBillingModelData(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/billingModel");
  }

  public getCountryData(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/country");
  }

  public getChargeBackData(): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/chargeBack");
  }

 public upsertChargeBack(chargeBackFilters): Observable<Object> {
    return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/upsertChargeBack",chargeBackFilters);
  }

  public getLegalEntityData(vscId): Observable<Object> {
    return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/legalEntity?vscId="+vscId);
  }
  
  
public getBillHubRefID(regKey,requestorSSO,entityTypeID):Observable<Object> { 
  return this.http.get(environment.APP_BILLHUB_URL_SERVICE_ENDPOINT+
    "/GetBillHubRefID?regKey="+regKey+
    "&requestorSSO="+requestorSSO+
    "&entityTypeID="+entityTypeID
  );
}

public associateBillReftoAsset(billRefId,assetID,regkey):Observable<Object> { 
  return this.http.get(environment.APP_BILLHUB_URL_SERVICE_ENDPOINT+
    "/AssociateBillReftoAsset?billRefAssetArray="+billRefId+","+
    assetID+
    "&regKey="+regkey
  );
}
public deleteBillRefbyId(billRefId):Observable<Object> { 
  //let gridDataStr = JSON.stringify(gridData);
  return this.http.post(environment.APP_BILLHUB_URL_SERVICE_ENDPOINT+
    "/v1/deleteBillRefbyId",billRefId);
} 

public getBillRefIDTokensAssociated(billRefId, regKey) : Observable<Object>{

  return this.http.get(environment.APP_BILLHUB_URL_SERVICE_ENDPOINT+
  "/ValidateBillRefTokens?billRefId="+billRefId+"&regKey="+regKey

  );
}

public getVSCData(vendorSrCtryId):Observable<Object> { 
  //let gridDataStr = JSON.stringify(gridData);
  return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT+
    "/getVSCountryData",vendorSrCtryId);
} 

public getFocusGroupDataId(cbId): Observable<Object> {
  return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/focusGroupForId?cbId="+cbId);
}
public getCloneBillingModel(cbId): Observable<Object> {
  return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/getCloneBillingModel?cbId="+cbId);
}
public setDropdownData(internalCbId,vendorId,productId,vscId):Observable<any[]>{
  let vendor= this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/chargeBackVendor?productId="+productId);
  let serviceType= this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+ "/chargeBackServiceType?vendorId="+vendorId+"&productId="+productId);
  let legalEntity = this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+"/legalEntity?vscId="+vscId);
  let focusGroup = this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT+ "/focusGroupForId?cbId="+internalCbId);

  // Using forkjoin property of observable to get multiple service values based on array values.
  return forkJoin([vendor,serviceType,legalEntity,focusGroup])
        .pipe(
          tap(results => this.setRefData(results)),
          catchError(error => this.handleError(error))
        ); 
}

public getSelectedChargeBackData(internalCbId,vendorId,productId,vscId):Observable<Object>{
  return this.http.get(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/getChargeBackData?cbId="+internalCbId+"&vendorId="+vendorId+"&productId="+productId+"&vscId="+vscId);
}

private setRefData(refDataResponse:any){ 
  this._vendorData = refDataResponse[0];
  this._serviceTypeData = refDataResponse[1];
  this._legalEntityData = refDataResponse[2];
  this._focusGroupData = refDataResponse[3];
}

public getVendorData(){ 
  return this._vendorData;
}

public getServiceTypeData1(){
  return this._serviceTypeData;
}
public getLegalEntityData1(){
 return this._legalEntityData
}
public getFocusGroupData1(){
  return this._focusGroupData;
}


 /**
    * Function For Error Handling.
    */
   private handleError(error){ 
    console.log(error);
   return throwError(error);
  }
}
