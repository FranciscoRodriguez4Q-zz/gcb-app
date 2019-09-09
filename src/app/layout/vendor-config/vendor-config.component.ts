import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { VendorConfigService } from './vendor-config.service';
import { ServiceTypeService } from '../service-type/service-type.service';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vendor-config',
  templateUrl: './vendor-config.component.html',
  styleUrls: ['./vendor-config.component.scss']
})
export class VendorConfigComponent implements OnInit {
  
public vendorReferenceData : any;
vendorReferenceDataList :SelectItem[] = [];
public countryCodeReferenceData: any;
countryCodeReferenceDataList: SelectItem[] = [];
public currencyCodeReferenceData: any;
currencyCodeReferenceDataList: SelectItem[] = [];
vendorGridDataList :SelectItem[] = [];
vendorGridData : any;
dwnVendor:any;

public popupErrorMessage : any;
public errorMessage :any;
public saveMessage: any = [];
@ViewChild('content1') errorMessagePopUp;
closeResult: string;
public editFlag: boolean;

public vendorConfigDto : any ={vendorConfigId:0,
vendorEntityId:"Select",
vendorLegalEntityName:"",
vendorCode:"",
vendorFriendlyName:"",
billedFromCountry:"Select",
billedFromLocationId:0,
billedToCountry:"Select",
billedToLocationId:0,
currencyCode:"",
active:true,
dateFormat:"",
lldCoeFlag:false,
exchangeRateType:"",
vendorContactEmail:"",
expectedFeedDate:"",
finalInvoiceDate:"",
reportingSecurityDl:"",
created:"",
createdBy:"",
lastUpdated:"",
lastUpdatedBy:""
};

public cols = [
  { field: 'vendorFriendlyName', header: 'Friendly Name', width: '40%' },
  { field: 'currencyCode', header: 'Currency Code', width: '12%' },
  { field: 'billedFromCountry', header: 'Billed From', width: '18%' },
  { field: 'billedToCountry', header: 'Billed To', width: '18%' },
  { field: 'vendorCode', header: 'Vendor Code', width: '12%' },
  { field: 'updatedBy', header: 'Updated By', width: '10%' },
  { field: 'lastUpdated', header: 'Updated Date', width: '16%' },

];
constructor( private vendorConfigService: VendorConfigService, private serviceTypeService : ServiceTypeService,private modalService: NgbModal) {
    
   }

ngOnInit() { 

    this.getAllVendorsData();
    this.getAllCountryData();
    this.getAllCurrencyCodeData();
    this.getVendorDetailGridData();
}

getAllVendorsData() {
  this.vendorConfigService.getAllVendors().subscribe(
    refData => {
      let arr: any = [];
      this.vendorReferenceData = refData;
      this.vendorReferenceDataList.push({ label: "Select", value: "Select" })

      for (let data of this.vendorReferenceData) {
        this.vendorReferenceDataList.push({ label: data.vendorLegalEntityName, value: data.vendorEntityId })
      }
    },
    error => {
    });
}

getAllCountryData(){
  this.vendorConfigService.getAllCountryCode().subscribe(
    refData => {
      let arr: any = [];
      this.countryCodeReferenceData = refData;
      this.countryCodeReferenceDataList.push({ label: "Select", value: "Select" })

      for (let data of this.countryCodeReferenceData) {
        let labelCountry = data.countryCode + " | " + data.countryName;
        this.countryCodeReferenceDataList.push({ label: labelCountry, value: data.countryId })
      }
    },
    error => {
    });
}

getAllCurrencyCodeData() {
  this.vendorConfigService.getAllCurrencyCode().subscribe(
    refData => {
      let arr: any = [];
      this.currencyCodeReferenceData = refData;
      this.currencyCodeReferenceDataList.push({ label: "Select", value: "Select" })

      for (let data of this.currencyCodeReferenceData) {
        this.currencyCodeReferenceDataList.push({ label: data.currencyCode, value: data.currencyCode })
      }
    },
    error => {
    });
}

getVendorDetailGridData() {
  this.vendorConfigService.getVendorGridData().subscribe(
    refData => {
      this.vendorGridData = refData;
      this.dwnVendor=refData;
    },
    error => {
    });
}

clearAllFilters() {
  this.errorMessage = "";
  this.editFlag = false;
  this.vendorConfigDto={vendorConfigId:0,
    vendorEntityId:"Select",
    vendorLegalEntityName:"",
    vendorCode:"",
    vendorFriendlyName:"",
    billedFromCountry:"Select",
    billedFromLocationId:0,
    billedToCountry:"Select",
    billedToLocationId:0,
    currencyCode:"",
    active:true,
    dateFormat:"",
    lldCoeFlag:false,
    exchangeRateType:"",
    vendorContactEmail:"",
    expectedFeedDate:"",
    finalInvoiceDate:"",
    reportingSecurityDl:"",
    created:"",
    createdBy:"",
    lastUpdated:"",
    lastUpdatedBy:""
    };
  this.popupErrorMessage = "";
  this.getVendorDetailGridData();
}

upsertVendorConfig(){
  this.errorMessage = "";
  console.log("upsert vendor config");
  if (this.validation()) {
    if (this.vendorConfigDto.vendorEntityId != "Select" 
    && this.vendorConfigDto.billedFromLocationId!= "Select" 
    && this.vendorConfigDto.billedToLocationId != "Select") {
      this.vendorConfigService.upsertVendorConfig(this.vendorConfigDto).subscribe(
        refData => {
          this.saveMessage = refData;
          console.log("upsert vendorConfig return outmap :"+this.saveMessage);
          console.log("upsert vendorConfig return message :"+this.saveMessage.message);
          this.popupErrorMessage =  this.saveMessage.message;
          this.open(this.errorMessagePopUp);
          this.getVendorDetailGridData();
        },
        error => {
        });
    }
}
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
  if (this.vendorConfigDto.vendorEntityId == "Select") {
    this.errorMessage = "Please select the Vendor Name";
    return false;
  }
  if (this.vendorConfigDto.billedFromLocationId == "Select") {
    this.errorMessage = "Please select from Country ";
    return false;
  }
  if (this.vendorConfigDto.billedToLocationId == "Select") {
    this.errorMessage = "Please select to Country ";
    return false;
  }
  if (this.vendorConfigDto.vendorCode == "") {
    this.errorMessage = "Please select Vendor Code";
     return false;
  }
  if (this.vendorConfigDto.vendorFriendlyName == "") {
    this.errorMessage = "Please select Vendor Friendly Name";
     return false;
  }
  return true;
}

showSelectedData(vendorConfigId) {
  console.log("vendorConfig modify click :" + vendorConfigId);
  this.editFlag = true;
  this.vendorConfigDto = this.vendorGridData.filter(x => x.vendorConfigId == vendorConfigId)[0];
}

}
