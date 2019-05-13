import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { VendorServiceCountryService } from './vendor-service-country.service';

@Component({
  selector: 'app-vendor-service-country',
  templateUrl: './vendor-service-country.component.html',
  styleUrls: ['./vendor-service-country.component.scss']
})
export class VendorServiceCountryComponent implements OnInit {

  countryCodeReferenceDataList: SelectItem[] = [];
  public countryCodeReferenceData: any;
  serviceTypeReferenceDataList: SelectItem[] = [];
  public serviceTypeReferenceData: any;
  vendorEntityReferenceDataList: SelectItem[] = [];
  public vendorEntityReferenceData: any;

  public vscFilters: any = {
    vendorEntity: "Select",
    billedFromCountryCode: "Select",
    serviceFromCountryCode: "Select",
    serviceType: "",
    suggestedCostCenter: "",
    vscMessage: ""
  };

  constructor(
    private vendorServiceCountryService: VendorServiceCountryService)
   { }

  ngOnInit() {

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

  

}
