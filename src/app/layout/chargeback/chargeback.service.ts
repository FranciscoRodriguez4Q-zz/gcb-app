import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChargebackService {

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

}
