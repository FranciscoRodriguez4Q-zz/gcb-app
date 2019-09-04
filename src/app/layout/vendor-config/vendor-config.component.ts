import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { VendorConfigService } from './vendor-config.service';
import { ServiceTypeService } from '../service-type/service-type.service';

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

public editFlag: boolean;

public vendorConfigDto : any =[{vendorConfigId:0,
vendorEntityId:0,
vendorLegalEntityName:"Select",
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
}];

public cols = [
  { field: 'vendorFriendlyName', header: 'Friendly Name', width: '40%' },
  { field: 'currencyCode', header: 'Currency Code', width: '12%' },
  { field: 'billedFromCountry', header: 'Billed From', width: '18%' },
  { field: 'billedToCountry', header: 'Billed To', width: '18%' },
  { field: 'vendorCode', header: 'Vendor Code', width: '12%' },
  { field: 'updatedBy', header: 'Updated By', width: '10%' },
  { field: 'lastUpdated', header: 'Updated Date', width: '16%' },

];
constructor( private vendorConfigService: VendorConfigService, private serviceTypeService : ServiceTypeService) {
    
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

showSelectedData(vendorConfigId) {
  console.log("radio button click" + vendorConfigId);
  this.editFlag = true;
  this.vendorConfigDto = this.vendorGridData.filter(x => x.vendorConfigId == vendorConfigId)[0];
}

}
