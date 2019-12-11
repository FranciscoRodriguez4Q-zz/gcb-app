import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { VendorConfigService } from './vendor-config.service';
import { ServiceTypeService } from '../service-type/service-type.service';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '../../shared/constants/globals';
import { Subscription, Observable } from 'rxjs';
import { HomeService } from '../home/home.service';
import { BackupModelService } from '../backupmodel.service';
import { SharedState } from 'src/app/shared/state/shared.state';
import { Select, Store } from '@ngxs/store';
import { SharedActions } from 'src/app/shared/state/shared.actions';
import { VendorConfigActions } from 'src/app/layout/vendor-config/state/vendor-config.actions';
import { VendorConfigState } from 'src/app/layout/vendor-config/state/vendor-config.state';

@Component({
  selector: 'app-vendor-config',
  templateUrl: './vendor-config.component.html',
  styleUrls: ['./vendor-config.component.scss']
})
export class VendorConfigComponent implements OnInit, OnDestroy {

vendorReferenceDataList :SelectItem[] = [];
public countryCodeReferenceData: any;
countryCodeReferenceDataList: SelectItem[] = [];
public currencyCodeReferenceData: any;
currencyCodeReferenceDataList: SelectItem[] = [];
currencyReferenceDataList:SelectItem[] = [];
public gridLoadFlag:boolean=false;


public vendorGridDataList :SelectItem[] = [];


lldCoeList : SelectItem[] =[
  { label: "Y", value: "Y" },
  { label: "N", value: "N" },
  { label: "L", value: "L" }  
];

exRateType : SelectItem[] =[
  { label: "MOR", value: "MOR" },
  { label: "SPOT", value: "SPOT" }
];

public vendorGridData : any;
public dwnVendor:any;
public reportHeader : any =[];
public fileName : string ="VendorConfig";

public popupErrorMessage : any;
public errorMessage :any;
public saveMessage: any = [];
@ViewChild('content1') errorMessagePopUp;
closeResult: string;
public editFlag: boolean;
public vendorCode:any;
public updatedBy:any;
public lastUpdated:any;
public downloadCols = [];
public userFlag: boolean = true;

public vendorConfigDto : any ={vendorConfigId:0,
vendorEntityId:"",
vendorLegalEntityName:"",
vendorCode:"",
billedFromLocationId:"",
billedToLocationId:"",
currencyCode:"",
active:true,
dateFormat:"",
lldCoeFlag:"",
exchangeRateType:"",
vendorContactEmail:"",
paymentApprovalEmail:"",
expectedFeedDate:"",
finalInvoiceDate:"",
reportingSecurityDl:"",
created:"",
createdBy:"",
lastUpdated:"",
lastUpdatedBy:""
};
public vendorConfigDtoCopy: any;

public cols = [
  { field: 'vendorLegalEntityName', header: 'Vendor Legal Entity Name', width: '40%' },
  { field: 'currencyCode', header: 'Currency Code', width: '12%' },
  { field: 'billedFromCountry', header: 'Billed From', width: '18%' },
  { field: 'billedToCountry', header: 'Billed To', width: '18%' },
  { field: 'vendorCode', header: 'Vendor Code', width: '12%' },
  { field: 'updatedBy', header: 'Updated By', width: '10%' },
  { field: 'lastUpdated', header: 'Updated Date', width: '16%' },

];

private readonly KEY: string = 'VendorConfig';
private subs: Subscription;

@Select(SharedState.getCountries) countryCodeReferenceDataList$: Observable<any>
@Select(SharedState.getUserDetails) userDetails$: Observable<any>
@Select(VendorConfigState.getCurrency) currencyReferenceDataList$: Observable<any>
@Select(VendorConfigState.getVendorNames) vendorReferenceDataList$: Observable<any>
@Select(VendorConfigState.getVendorDetails) vendorGridData$ : Observable<any>
@Select(VendorConfigState.getFetching) gridLoadFlag$: Observable<any>

constructor(
  private backupModelService: BackupModelService,
  private vendorConfigService: VendorConfigService, 
  private serviceTypeService : ServiceTypeService,
  private modalService: NgbModal,
  private store: Store,
  private homeService: HomeService
  ) { }

  async ngOnInit() {
    this.initStateOnComponent();
    this.setReportHeader();
    for (let i = 0; i < this.cols.length; i++) {
      // console.log("in Download method"+i);
      this.downloadCols.push(this.cols[i].header);
    }
  }

  ngOnDestroy() {
    this.backupModelService.vendorConfigTabModel = {
      vendorConfigDto: this.vendorConfigDto,
      editFlag: this.editFlag
    }
    this.homeService.setState({ key: this.KEY, data: null });
    if(this.subs != null && this.subs != undefined){
      this.subs.unsubscribe()
    }
  }

  initStateOnComponent() {
    this.store.dispatch(new SharedActions.FetchCountry())
    this.store.dispatch(new VendorConfigActions.FetchCurrency())
    this.store.dispatch(new VendorConfigActions.FetchVendorNames())
    this.store.dispatch(new VendorConfigActions.FetchVendorDetails())
    
    this.userDetails$.subscribe(({ roleNM }) => this.userFlag = roleNM !== 'ADMIN')
    this.gridLoadFlag$.subscribe( (isFetching) => this.gridLoadFlag = !isFetching)

    this.countryCodeReferenceDataList$.subscribe(items => {
      this.countryCodeReferenceDataList = items.map(({ countryCode, countryName, countryId }) => ({ 
        label: `${countryCode} | ${countryName}`, 
        value: countryId
      }))
    })
    this.currencyReferenceDataList$.subscribe(items => {
      this.currencyReferenceDataList = items.map(({ currencyDescription, currencyCode }) => ({ 
        label: `${currencyCode} |  ${currencyDescription}`, 
        value: currencyCode
      }))
    })
    this.vendorReferenceDataList$.subscribe(items => {
      this.vendorReferenceDataList = items.map(({ vendorLegalEntityName, vendorEntityId }) => ({ 
        label: vendorLegalEntityName,
        value: vendorEntityId
      }));
    })
    this.vendorGridData$.subscribe(items => {
      this.vendorGridData = items
      this.dwnVendor = items.map(item => {
        return {
          vendorLegalEntityName: item.vendorLegalEntityName,
          currencyCode: item.currencyCode,
          billedFromCountry: item.billedFromCountry,
          billedToCountry: item.billedToCountry,
          vendorCode: item.vendorCode,
          updatedBy: item.updatedBy,
          lastUpdated: item.lastUpdated,
        };
      })
      this.initTreeSubscribe()
    })
  }

  initTreeSubscribe() {
    if(this.backupModelService.vendorConfigTabModel != null 
      && this.backupModelService.vendorConfigTabModel != undefined){
        this.vendorConfigDto = this.backupModelService.vendorConfigTabModel.vendorConfigDto;
        this.editFlag = this.backupModelService.vendorConfigTabModel.editFlag;
      }
    this.subs = this.homeService.state$.subscribe(({ [this.KEY]: item }) => {
      if (item) {
        const { id } = item;
        this.showSelectedData(id);
      }
    })
  }

setReportHeader()
{
  for(let col of this.cols )
  {
    this.reportHeader.push(col.header);
  }
}

clearAllFilters() {
  this.errorMessage = "";
  this.editFlag = false;
  this.vendorConfigDto={vendorConfigId:0,
    vendorEntityId:"",
    vendorLegalEntityName:"",
    vendorCode:"",
    billedFromLocationId:"",
    billedToLocationId:"",
    currencyCode:"",
    active:true,
    dateFormat:"",
    lldCoeFlag:"",
    exchangeRateType:"",
    vendorContactEmail:"",
    paymentApprovalEmail:"",
    expectedFeedDate:"",
    finalInvoiceDate:"",
    reportingSecurityDl:"",
    created:"",
    createdBy:"",
    lastUpdated:"",
    lastUpdatedBy:""
    };
  //this.popupErrorMessage = "";
  this.vendorConfigDtoCopy = {};
}

async upsertVendorConfig(){
  if (this.validation()) {
    if (this.vendorConfigDto.vendorEntityId != "Select" && this.vendorConfigDto.billedFromLocationId!= "Select" && this.vendorConfigDto.billedToLocationId != "Select") {
      try{
        await this.store.dispatch(new VendorConfigActions.UpsertVendorConfig(this.vendorConfigDto))
        this.clearAllFilters()
      }catch(e){}
    }
  }
}

validation() {
  if (this.vendorConfigDto.vendorEntityId == null||
    this.vendorConfigDto.vendorEntityId == "Select"||
    this.vendorConfigDto.vendorEntityId == "") {
    this.errorMessage = "Please select the Vendor Name";
    return false;
  }
  if (this.vendorConfigDto.vendorCode == "") {
    this.errorMessage = "Please select Vendor Code";
     return false;
  }
  // if (this.vendorConfigDto.vendorContactEmail == "") {
  //   this.errorMessage = "Please select Vendor Contact Email";
  //    return false;
  // }
  if (this.vendorConfigDto.currencyCode ==null||
    this.vendorConfigDto.currencyCode == ""||
    this.vendorConfigDto.currencyCode == "Select") {
    this.errorMessage = "Please select Currency Code";
     return false;
  }
  if (this.vendorConfigDto.billedFromLocationId == null || 
    this.vendorConfigDto.billedFromLocationId == "" || 
    this.vendorConfigDto.billedFromLocationId == "Select") {
    this.errorMessage = "Please select From location ";
    return false;
  }
  if (this.vendorConfigDto.billedToLocationId == null || 
    this.vendorConfigDto.billedToLocationId == "" || 
    this.vendorConfigDto.billedToLocationId == "Select") {
    this.errorMessage = "Please select To location ";
    return false;
  }
  if (this.vendorConfigDto.dateFormat == "") {
    this.errorMessage = "Please select Date Format";
     return false;
  }
  // if (this.vendorConfigDto.lldCoeFlag == "Select"||
  //     this.vendorConfigDto.lldCoeFlag == ""||
  //     this.vendorConfigDto.lldCoeFlag == null) {
  //   this.errorMessage = "Please select LLD Coe Flag";
  //   return false;
  // }
  // if (this.vendorConfigDto.exchangeRateType == "") {
  //   this.errorMessage = "Please select Exchange Rate Type";
  //    return false;
  // }
  // if (this.vendorConfigDto.paymentApprovalEmail == "") {
  //   this.errorMessage = "Please select Payment Approval Email";
  //    return false;
  // }
  // if (this.vendorConfigDto.expectedFeedDate == "") {
  //   this.errorMessage = "Please select Expected Feed Date";
  //    return false;
  // }
  // if (this.vendorConfigDto.finalInvoiceDate == "") {
  //   this.errorMessage = "Please select Final Invoice Date";
  //    return false;
  // }
  // if (this.vendorConfigDto.reportingSecurityDl == "") {
  //   this.errorMessage = "Please select Reporting Security DL";
  //    return false;
  // }
  return true;
}

showSelectedData(vendorConfigId) {
  console.log("vendorConfig modify click :" + vendorConfigId);
  this.editFlag = true;
  const modelTemp = this.vendorGridData.find(x => x.vendorConfigId == vendorConfigId);
  this.vendorConfigDto = { ...modelTemp };
  this.vendorConfigDtoCopy = { ...this.vendorConfigDto };
}

get disabled() {
  if (this.editFlag) {
    return JSON.stringify(this.vendorConfigDto) === JSON.stringify(this.vendorConfigDtoCopy);
  }
  return false;
}

}
