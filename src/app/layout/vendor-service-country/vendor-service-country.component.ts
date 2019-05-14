import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { VendorServiceCountryService } from './vendor-service-country.service';

@Component({
  selector: 'app-vendor-service-country',
  templateUrl: './vendor-service-country.component.html',
  styleUrls: ['./vendor-service-country.component.scss']
})
export class VendorServiceCountryComponent implements OnInit {

  public errorMessage = "";
  public saveMessage: any = [];

  countryCodeReferenceDataList: SelectItem[] = [];
  public countryCodeReferenceData: any;

  serviceTypeReferenceDataList: SelectItem[] = [];
  public serviceTypeReferenceData: any;

  vendorEntityReferenceDataList: SelectItem[] = [];
  public vendorEntityReferenceData: any;

  vendorSrCountryData: any = [];
  public cols = [
    { field: 'vendorServiceCountryId', header: 'Vendor Service Country Id', width: '12%' },
    { field: 'vendorEntityName', header: 'Vendor Entity Name', width: '10%' },
    { field: 'serviceTypeName', header: 'Service Type Name', width: '10%' },
    { field: 'billedFromCountryCode', header: 'Billed From Country Code', width: '13%' },
    { field: 'servicedFromCountryCode', header: 'Serviced From Country Code', width: '13%' },
    { field: 'suggestedCostCenterDefault', header: 'Suggested Cost Center', width: '10%' },
    { field: 'createdDate', header: 'Created Date', width: '10%' },
    { field: 'createdBy', header: 'Created By', width: '7%' },
    { field: 'updatedDate', header: 'Updated Date', width: '10%' },
    { field: 'updatedBy', header: 'Updated By', width: '7%' }
  ];


  public editFlag = false;
  public expansionEventFlag = true;
  public fileName: any = "VSC";

  public vscDtoObj: any = {
    vendorServiceCountryId: "",
    vendorEntityId:"Select",
    serviceTypeId:"Select",
    billedFromCountryCode: "Select",
    servicedFromCountryCode: "Select",
    suggestedCostCenterDefault: ""
  };

  constructor(
    private vendorServiceCountryService: VendorServiceCountryService) { }

  ngOnInit() {

    this.getAllVendorServiceCountry();
    this.vendorServiceCountryService.getAllCountryData().subscribe(
      refData => {
        let arr: any = [];
        this.countryCodeReferenceData = refData;
        this.countryCodeReferenceDataList.push({ label: "Select", value: "Select" })

        for (let data of this.countryCodeReferenceData) {
          this.countryCodeReferenceDataList.push({ label: data.countryName, value: data.countryAbbreviation })
        }
      },
      error => {
      });

    this.vendorServiceCountryService.getAllServiceType().subscribe(
      refData => {
        let arr: any = [];
        this.serviceTypeReferenceData = refData;
        this.serviceTypeReferenceDataList.push({ label: "Select", value: "Select" })

        for (let data of this.serviceTypeReferenceData) {
          this.serviceTypeReferenceDataList.push({ label: data.serviceType, value: data.serviceTypeId })
        }
      },
      error => {
      });

    this.vendorServiceCountryService.getAllVendorEntity().subscribe(
      refData => {
        let arr: any = [];
        this.vendorEntityReferenceData = refData;
        this.vendorEntityReferenceDataList.push({ label: "Select", value: "Select" })

        for (let data of this.vendorEntityReferenceData) {
          this.vendorEntityReferenceDataList.push({ label: data.vendorLegalEntityName, value: data.vendorEntityId })
        }
      },
      error => {
      });

  }

  getAllVendorServiceCountry() {
    this.vendorServiceCountryService.getVendorSrCountryData().subscribe(
      refData => {
        this.vendorSrCountryData = refData;
      },
      error => {
      });
  }

  showSelectedData(vendorSrCtryId) {
    this.editFlag = true;
    this.vscDtoObj = this.vendorSrCountryData.filter(x => x.vendorServiceCountryId == vendorSrCtryId)[0];
  }

  upsertVendorServiceCountry()
  {
    this.errorMessage = "";

    console.log("test button click");
    if (this.validation()) {
      if (this.vscDtoObj.vendorEntityId != "Select" 
      && this.vscDtoObj.serviceTypeId != "Select" 
      && this.vscDtoObj.billedFromCountryCode != "Select"
      && this.vscDtoObj.servicedFromCountryCode !="select"
      && this.vscDtoObj.suggestedCostCenterDefault !="") {
        this.vendorServiceCountryService.upsertVendorServiceCountry(this.vscDtoObj).subscribe(
          refData => {
            this.saveMessage = refData;
            this.errorMessage = this.saveMessage.statusMessage;

            this.getAllVendorServiceCountry;
          },
          error => {
          });
      }
    }
  }

  validation() {
    if (this.vscDtoObj.vendorEntityId == "Select") {
      this.errorMessage = "Please select the Vendor Entity Name";
      return false;
    }
    if (this.vscDtoObj.serviceTypeId == "Select") {
      this.errorMessage = "Please select the Service Type";
      return false;
    }
    if (this.vscDtoObj.billedFromCountryCode == "Select") {
      this.errorMessage = "Please select the Billed From Country";
      return false;
    }
    if (this.vscDtoObj.servicedFromCountryCode == "Select") {
      this.errorMessage = "Please select the Serviced From Country";
      return false;
    }
    if (this.vscDtoObj.suggestedCostCenterDefault == "") {
      this.errorMessage = "Please enter the Suggested Cost Center";
      return false;
    }
    return true;
  }

  clearAll()
  {
    this.editFlag = false;
    this.vscDtoObj = {
      vendorServiceCountryId: "",
      vendorEntityId:"Select",
      serviceTypeId:"Select",
      billedFromCountryCode: "Select",
      servicedFromCountryCode: "Select",
      suggestedCostCenterDefault: ""
    };
  }

}
