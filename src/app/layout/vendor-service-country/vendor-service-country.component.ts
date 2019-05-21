import { Component, OnInit,  ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { VendorServiceCountryService } from './vendor-service-country.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vendor-service-country',
  templateUrl: './vendor-service-country.component.html',
  styleUrls: ['./vendor-service-country.component.scss'],
  providers: [VendorServiceCountryService, MessageService]

})
export class VendorServiceCountryComponent implements OnInit {

  public errorMessage = "";
  public saveMessage: any = [];
  productReferenceDataList: SelectItem[] = [];
  public productReferenceData: any;
  billingReferenceDataList: SelectItem[] = [];
  public billingBasisReferenceData: any;
  countryCodeReferenceDataList: SelectItem[] = [];
  public countryCodeReferenceData: any;

  serviceTypeReferenceDataList: SelectItem[] = [];
  public serviceTypeReferenceData: any;

  vendorEntityReferenceDataList: SelectItem[] = [];
  public vendorEntityReferenceData: any;
  @ViewChild('content1') errorMessagePopUp;
  public popupErrorMessage: any;
  closeResult: string;
  vendorSrCountryData: any = [];
  vSCountryData: any = [];
  public downloadCols = [];
  public fileName : any ="VSC";
  public cols = [
    { field: 'vendorEntityName', header: 'Vendor Entity Name', width: '10%' },
    { field: 'productName', header: 'Product Name', width: '10%' },
    { field: 'countryNm', header: 'Consumed In', width: '10%' },
    { field: 'serviceTypeName', header: 'Service Type Name', width: '10%' },
    { field: 'billedFromCountryCode', header: 'Billed From Country', width: '13%' },
    { field: 'servicedFromCountryCode', header: 'Serviced From Country', width: '13%' },
    { field: 'billedToCountryCode', header: 'Billed To Country', width: '13%' },
    { field: 'suggestedCostCenterDefault', header: 'Suggested Cost Center', width: '10%' },
    { field: 'createdDate', header: 'Created Date', width: '10%' },
    { field: 'createdBy', header: 'Created By', width: '7%' },
    { field: 'lastUpdatedDate', header: 'Updated Date', width: '10%' },
    { field: 'updatedBy', header: 'Updated By', width: '7%' }
  ];


  public editFlag = false;
  public expansionEventFlag = true;
  public delimiter ="_";
  public vscDtoObj: any = {
    vendorServiceCountryId: "",
    vendorEntityId:"Select",
    serviceTypeName:"",
    billedFromCountryCode: "Select",
    servicedFromCountryCode: "Select",
    billedToCountryCode: "Select",
    suggestedCostCenterDefault: "",
    productId: 0,
    consumedInCountryCode: "Select",
    billingBasis: "Select",
    vProductPrefix:"",
    unspscCode:"",
    vInvoiceDesc:"",
    suggestedServiceType:"",
    useSuggested: false
  };

  constructor(
    private vendorServiceCountryService: VendorServiceCountryService, private messageService: MessageService, private modalService: NgbModal) { }

  ngOnInit() {

    this.getAllVendorServiceCountry();
    this.getAllProductData();
    this.getAllCountryData();
    //this.getAllServiceType();
    this.getBillingBasisData();
    for (let i = 0; i < this.cols.length; i++) {
      this.downloadCols.push(this.cols[i].header);
      //this.downloadCols[this.cols[i].header] = "";
    }
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
      this.getVSCdwData();
  }
  getAllCountryData(){
    this.vendorServiceCountryService.getAllCountryData().subscribe(
      refData => {
        let arr: any = [];
        this.countryCodeReferenceData = refData;
        this.countryCodeReferenceDataList.push({ label: "Select", value: "Select" })

        for (let data of this.countryCodeReferenceData) {
          let labelCountry = data.countryAbbreviation + " | " + data.countryName;
          this.countryCodeReferenceDataList.push({ label: labelCountry, value: data.countryAbbreviation })
        }
      },
      error => {
      });
  }
  getAllServiceType(){
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
  }

  getAllProductData(){
    this.vendorServiceCountryService.getAllProductData()
    .subscribe(
    refData => {
      let arr: any = [];
      this.productReferenceData = refData;
      this.productReferenceDataList.push({ label: "Select", value: "Select" })
      for (let data of this.productReferenceData) {
        let labelProd = data.serviceTypePrefix + " | " + data.productName
        this.productReferenceDataList.push({ label: labelProd, value: data.productId })

      }
    },
    error => {
      console.log(error);
    });

  }
  getBillingBasisData(){
    this.vendorServiceCountryService.getBillingBasisData().subscribe(
      refData => {
        let arr: any = [];

        this.billingBasisReferenceData = refData;
        this.billingReferenceDataList.push({ label: "Select", value: "Select" })

        for (let data of this.billingBasisReferenceData) {
          this.billingReferenceDataList.push({ label: data.billbasisname, value: data.billbasisname })
        }
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
        this.vendorServiceCountryService.upsertVendorServiceCountry(this.vscDtoObj).subscribe(
          refData => {
            this.saveMessage = refData;
            //this.errorMessage = this.saveMessage.statusMessage;
            this.popupErrorMessage =  this.saveMessage.statusMessage;
            this.open(this.errorMessagePopUp);
            this.getAllVendorServiceCountry();
          },
          error => {
          });
      
    }
  }

  validation() {
    
    if (this.vscDtoObj.productId == 0) {
      this.errorMessage = "Please select the Product";
      return false;
    }
    if (this.vscDtoObj.consumedInCountryCode == "Select") {
      this.errorMessage = "Please select the Consumed In";
      return false;
    }
    if (this.vscDtoObj.vendorEntityId == "Select") {
      this.errorMessage = "Please select the Vendor Entity Name";
      return false;
    }
    if (this.vscDtoObj.serviceTypeName == null || this.vscDtoObj.serviceTypeName == "") {
      this.errorMessage = "Please Enter the Service Type Name";
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
    if (this.vscDtoObj.vProductPrefix == null || this.vscDtoObj.vProductPrefix == "") {
      this.errorMessage = "Please enter Vendor Product Prefix";
      return false;
    }
    if (this.vscDtoObj.vInvoiceDesc == null || this.vscDtoObj.vInvoiceDesc == "") {
      this.errorMessage = "Please enter Vendor Inv Desc";
      return false;
    }
    if (this.vscDtoObj.unspscCode == null || this.vscDtoObj.unspscCode == "") {
      this.errorMessage = "Please enter unspscCode";
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
      serviceTypeId:0,
      billedFromCountryCode: "Select",
      servicedFromCountryCode: "Select",
      billedToCountryCode: "Select",
      suggestedCostCenterDefault: "",
      productId: 0,
      consumedInCountryCode: "Select",
      billingBasis: "Select",
      vProductPrefix:"",
      unspscCode:"",
      vInvoiceDesc:"",
      suggestedServiceType:"",
      useSuggested: false
    };
    this.popupErrorMessage = "";
    this.errorMessage = "";
  }

  getServicetype() {
    this.errorMessage = "";
    if (this.vscDtoObj.productId != "Select" && this.vscDtoObj.billedFromCountryCode != "Select" && this.vscDtoObj.billedToCountryCode != "Select" && this.vscDtoObj.vProductPrefix != "") {
      debugger;
      let productData = this.productReferenceData.filter(x => x.productId == this.vscDtoObj.productId)[0];
      this.vscDtoObj.suggestedServiceType = productData.serviceTypePrefix +this.delimiter+ this.vscDtoObj.vProductPrefix.toUpperCase()+this.delimiter+ this.vscDtoObj.billedFromCountryCode+this.delimiter+ this.vscDtoObj.billedToCountryCode;
      if(this.vscDtoObj.useSuggested==true){
        this.vscDtoObj.serviceTypeName = this.vscDtoObj.suggestedServiceType;
      }
      this.vendorServiceCountryService.getServicetype(this.vscDtoObj).subscribe(
        refData => {
          this.vscDtoObj = refData;
        },
        error => {
        });
    }

  }

  checkValue(){
console.log(this.vscDtoObj.useSuggested);
  if(this.vscDtoObj.useSuggested==true){
    this.vscDtoObj.serviceTypeName = this.vscDtoObj.suggestedServiceType;
  }
  }
   /**
   * Method to open modal pop up.
   * @param: content: @ViewChild
   */
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  /**
   * Private Method to get popup dismissed reason Can be removed if not needed.
   * @param: reason: $event.
   */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getVSCdwData(){
    
    this.vendorServiceCountryService.getVSCountryDWData(this.downloadCols).subscribe(
      refData => {
        this.vSCountryData = refData;
      },
      error => {
      });
}
}

