import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { SampleExService } from './service-type.service';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-service-type',
  templateUrl: './service-type.component.html',
  styleUrls: ['./service-type.component.scss'],
  providers: [SampleExService, MessageService]

})
export class ServiceTypeComponent implements OnInit {
  checked1: boolean = false;
  serviceTypes: any = [];
  msgs: Message[] = [];
  productReferenceDataList: SelectItem[] = [];
  countryCodeReferenceDataList: SelectItem[] = [];
  billingReferenceDataList: SelectItem[] = [];
  public productReferenceData: any;
  public countryCodeReferenceData: any;
  public billingBasisReferenceData: any;
  public saveMessage: any = [];
  public errorMessage = "";
  public editFlag = false;
  public expansionEventFlag = true;
  public gcbDetailFilters: any = {
    productId: "Select",
    countryCode: "Select",
    billingBasis: "Select",
    serviceType: "",
    suggestedServiceType: "",
    serviceTypeMessage: "",
    useSuggested: true
  };
  constructor(private sampleExService: SampleExService, private messageService: MessageService) { }

  public cols = [
    { field: 'productNm', header: 'Product Name', width: '15%' },
    { field: 'countryNm', header: 'Country Name', width: '15%' },
    { field: 'serviceType', header: 'Service Type', width: '8%' },
    { field: 'billingBasis', header: 'Billing Basis', width: '8%' },
    { field: 'createdBy', header: 'Created By', width: '7%' },
    { field: 'createdDate', header: 'Created Date', width: '15%' },
    { field: 'updatedBy', header: 'Updated By', width: '7%' },
    { field: 'updatedDate', header: 'Updated Date', width: '15%' },

  ];

   ngOnInit() {
  //   this.getAllServiceType();
  //   console.log("im in ngonit");
  //   this.sampleExService.getAllSegmentData()
  //     .subscribe(
  //     refData => {
  //       let arr: any = [];
  //       this.productReferenceData = refData;
  //       this.productReferenceDataList.push({ label: "Select", value: "Select" })
  //       for (let data of this.productReferenceData) {
  //         this.productReferenceDataList.push({ label: data.productName, value: data.productId })

  //       }
  //     },
  //     error => {
  //       console.log(error);
  //     });


  //   this.sampleExService.getAllCountryData().subscribe(
  //     refData => {
  //       let arr: any = [];
  //       this.countryCodeReferenceData = refData;
  //       this.countryCodeReferenceDataList.push({ label: "Select", value: "Select" })

  //       for (let data of this.countryCodeReferenceData) {
  //         this.countryCodeReferenceDataList.push({ label: data.countryName, value: data.countryAbbreviation })
  //       }
  //     },
  //     error => {
  //     });

  //   this.sampleExService.getBillingBasisData().subscribe(
  //     refData => {
  //       let arr: any = [];

  //       this.billingBasisReferenceData = refData;
  //       this.billingReferenceDataList.push({ label: "Select", value: "Select" })

  //       for (let data of this.billingBasisReferenceData) {
  //         this.billingReferenceDataList.push({ label: data.billbasisname, value: data.billbasisname })
  //       }
  //     },
  //     error => {
  //     });


  }

  getServicetype() {
    this.errorMessage = "";
    this.msgs = [];
    if (this.gcbDetailFilters.productId != "Select" && this.gcbDetailFilters.countryCode != "Select") {
      let productData = this.productReferenceData.filter(x => x.productId == this.gcbDetailFilters.productId)[0];
      console.log("Product Selected : " + productData);
      this.gcbDetailFilters.suggestedServiceType = productData.serviceTypePrefix + this.gcbDetailFilters.countryCode;
      console.log("Product this.gcbDetailFilters.suggestedServiceType : " + this.gcbDetailFilters.suggestedServiceType);
      this.gcbDetailFilters.serviceType = this.gcbDetailFilters.suggestedServiceType;
      this.sampleExService.getServicetype(this.gcbDetailFilters).subscribe(
        refData => {
          this.gcbDetailFilters = refData;
        },
        error => {
        });
    }

  }
  upsertServiceType() {
    this.errorMessage = "";
    this.msgs = [];
    console.log("test button click");
    if (this.validation()) {
      if (this.gcbDetailFilters.productId != "Select" && this.gcbDetailFilters.countryCode != "Select" && this.gcbDetailFilters.billingBasis != "Select") {
        this.sampleExService.upsertServiceType(this.gcbDetailFilters).subscribe(
          refData => {
            this.saveMessage = refData;
            this.errorMessage = this.saveMessage.statusMessage;
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: this.errorMessage, detail: '' });
            this.getAllServiceType();
          },
          error => {
          });
      }
    }
  }
  validation() {
    if (this.gcbDetailFilters.productId == "Select") {
      this.errorMessage = "Please select Product Name";
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: this.errorMessage, detail: 'Validation failed' });
      this.messageService.add({ key: 'msgs1', severity: 'error', summary: this.errorMessage, detail: 'Detail Text' });

      return false;
    }
    if (this.gcbDetailFilters.countryCode == "Select") {
      this.errorMessage = "Please select Country Code";
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: this.errorMessage, detail: 'Validation failed' });
      return false;
    }
    if (this.gcbDetailFilters.billingBasis == "Select") {
      this.errorMessage = "Please select Billing Basis";
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: this.errorMessage, detail: 'Validation failed' });
      return false;
    }
    return true;
  }
  getAllServiceType() {
    console.log("getAllServiceType");
    this.sampleExService.getServicetypeData().subscribe(
      refData => {
        this.serviceTypes = refData;
      },
      error => {
      });
  }
  clearAllFilters() {
    this.errorMessage = "";
    this.messageService.clear();
    this.msgs = [];
    this.editFlag = false;
    this.gcbDetailFilters = {
      productId: "Select",
      countryCode: "Select",
      billingBasis: "Select",
      serviceType: "",
      suggestedServiceType: "",
      serviceTypeMessage: "",
      useSuggested: true
    };
  }

  showSelectedData(serviceTypeId) {
    console.log("radio button click" + serviceTypeId);
    this.editFlag = true;
    this.gcbDetailFilters = this.serviceTypes.filter(x => x.serviceTypeId == serviceTypeId)[0];
  }

}
