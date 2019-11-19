import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { VendorConfigService } from './vendor-config.service';
import { ServiceTypeService } from '../service-type/service-type.service';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '../../shared/constants/globals';
import { Subscription } from 'rxjs';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'app-vendor-config',
  templateUrl: './vendor-config.component.html',
  styleUrls: ['./vendor-config.component.scss']
})
export class VendorConfigComponent implements OnInit, OnDestroy {
  
public vendorReferenceData : any;
vendorReferenceDataList :SelectItem[] = [];
public countryCodeReferenceData: any;
countryCodeReferenceDataList: SelectItem[] = [];
public currencyCodeReferenceData: any;
currencyCodeReferenceDataList: SelectItem[] = [];
public currencyReferenceData: any;
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

constructor(
  private vendorConfigService: VendorConfigService, 
  private serviceTypeService : ServiceTypeService,
  private modalService: NgbModal,
  private globals: Globals,
  private homeService: HomeService
  ) {
  if (this.globals.roleNM==='ADMIN') {
    this.userFlag = false;
  }
  else {
    this.userFlag = true;
  }
   }

  async ngOnInit() {
    this.setReportHeader();
    await this.getAllVendorsData();
    await this.getAllCountryData();
    await this.getAllCurrencyData();
    await this.getVendorDetailGridData();

    for (let i = 0; i < this.cols.length; i++) {
      // console.log("in Download method"+i);
      this.downloadCols.push(this.cols[i].header);
    }
    await this.getDwnVendorConfigData();
    this.subs = this.homeService.state$.subscribe(({ [this.KEY]: item }) => {
      if (item) {
        const { id } = item;
        this.showSelectedData(id);
      }
    })
  }

  ngOnDestroy() {
    this.homeService.setState({ key: this.KEY, data: null });
    if(this.subs != null && this.subs != undefined){
      this.subs.unsubscribe()
    }
  }


setReportHeader()
{
  for(let col of this.cols )
  {
    this.reportHeader.push(col.header);
  }
}

  getAllVendorsData() {
    return this.vendorConfigService.getAllVendors().toPromise().then(
      refData => {
        let arr: any = [];
        this.vendorReferenceData = refData;
        for (let data of this.vendorReferenceData) {
          this.vendorReferenceDataList.push({ label: data.vendorLegalEntityName, value: data.vendorEntityId })
        }
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     let arr: any = [];
    //     this.vendorReferenceData = refData;
    //     for (let data of this.vendorReferenceData) {
    //       this.vendorReferenceDataList.push({ label: data.vendorLegalEntityName, value: data.vendorEntityId })
    //     }
    //   },
    //   error => {
    //   });
  }

  getAllCurrencyData() {
    return this.vendorConfigService.getAllCurrency().toPromise().then(
      refData => {
        this.currencyReferenceData = refData;
        for (let data of this.currencyReferenceData) {
          let currencyLebel = data.currencyCode + " | " + data.currencyDescription;
          this.currencyReferenceDataList.push({ label: currencyLebel, value: data.currencyCode })
        }
      }
    ).catch(console.log)
    // .subscribe(
    //     refData => {
    //       this.currencyReferenceData = refData;
    //       for (let data of this.currencyReferenceData) {
    //         let currencyLebel = data.currencyCode+" | "+data.currencyDescription;
    //         this.currencyReferenceDataList.push({ label: currencyLebel, value: data.currencyCode })
    //       }
    //     },
    //     error => {
    //     });
  }

  getAllCountryData() {
    return this.vendorConfigService.getAllCountryCode().toPromise().then(
      refData => {
        let arr: any = [];
        this.countryCodeReferenceData = refData;

        for (let data of this.countryCodeReferenceData) {
          let labelCountry = data.countryCode + " | " + data.countryName;
          this.countryCodeReferenceDataList.push({ label: labelCountry, value: data.countryId })
        }
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     let arr: any = [];
    //     this.countryCodeReferenceData = refData;

    //     for (let data of this.countryCodeReferenceData) {
    //       let labelCountry = data.countryCode + " | " + data.countryName;
    //       this.countryCodeReferenceDataList.push({ label: labelCountry, value: data.countryId })
    //     }
    //   },
    //   error => {
    //   });
  }

  getDwnVendorConfigData() {
    return this.vendorConfigService.getDwnVendorConfigData().toPromise().then(
      refData => {
        //this.vendorGridData = refData;
        this.dwnVendor = refData;
        this.dwnVendor.map(item => {
          return {
            vendorLegalEntityName: item.vendorLegalEntityName,
            currencyCode: item.currencyCode,
            billedFromCountry: item.billedFromCountry,
            billedToCountry: item.billedToCountry,
            vendorCode: this.vendorCode,
            updatedBy: this.updatedBy,
            lastUpdated: this.lastUpdated,
          }
        }).forEach(item => this.dwnVendor.push(item));
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     //this.vendorGridData = refData;
    //     this.dwnVendor=refData;

    //     this.dwnVendor.map(item => {
    //       return {
    //         vendorLegalEntityName: item.vendorLegalEntityName,
    //         currencyCode: item.currencyCode,
    //         billedFromCountry: item.billedFromCountry,
    //         billedToCountry: item.billedToCountry,
    //         vendorCode:this.vendorCode,
    //         updatedBy:this.updatedBy,
    //         lastUpdated:this.lastUpdated,
    //       }
    //     }).forEach(item => this.dwnVendor.push(item));
    //   },
    //   error => {
    //   });
  }

  getVendorDetailGridData() {
    return this.vendorConfigService.getVendorGridData().toPromise().then(
      refData => {
        this.vendorGridData = refData;
        this.gridLoadFlag = true;
        //this.dwnVendor=refData;
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     this.vendorGridData = refData;
    //     this.gridLoadFlag=true;
    //     //this.dwnVendor=refData;
    //   },
    //   error => {
    //   });
  }

async clearAllFilters() {
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
  await this.getVendorDetailGridData();
}

upsertVendorConfig(){
  this.errorMessage = "";
  if (this.validation()) {
    if (this.vendorConfigDto.vendorEntityId != "Select" 
    && this.vendorConfigDto.billedFromLocationId!= "Select" 
    && this.vendorConfigDto.billedToLocationId != "Select") {
      this.vendorConfigService.upsertVendorConfig(this.vendorConfigDto).subscribe(
        refData => {
          this.saveMessage = refData;
          this.popupErrorMessage =  this.saveMessage.message;
          this.open(this.errorMessagePopUp);
          this.clearAllFilters();
        },
        error => {
          this.popupErrorMessage = "An system error occured";          
          this.open(this.errorMessagePopUp);
        });
    }
}
//this.clearAllFilters();

}

open(content) {
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}


private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
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
  this.vendorConfigDto = this.vendorGridData.filter(x => x.vendorConfigId == vendorConfigId)[0];
  this.vendorConfigDtoCopy = { ...this.vendorConfigDto };
}

get disabled() {
  if (this.editFlag) {
    return JSON.stringify(this.vendorConfigDto) === JSON.stringify(this.vendorConfigDtoCopy);
  }
  return false;
}

}
