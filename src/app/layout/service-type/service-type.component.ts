import { Component, OnInit,  ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { ServiceTypeService } from './service-type.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-service-type',
  templateUrl: './service-type.component.html',
  styleUrls: ['./service-type.component.scss'],
  providers: [ServiceTypeService, MessageService]

})
export class ServiceTypeComponent implements OnInit {
  checked1: boolean = false;
  public serviceTypes: any = [];
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
  public fileName : any ="ServiceType";
  public gcbDwnData : any = [];
  public gcbDetailFilters: any = {
    productId: "Select",
    countryCode: "Select",
    billingBasis: "Select",
    serviceType: "",
    suggestedServiceType: "",
    serviceTypeMessage: "",
    useSuggested: true
  };
  @ViewChild('content1') errorMessagePopUp;
  public popupErrorMessage: any;
  closeResult: string;
  public downloadCols = [];
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

  constructor(private serviceTypeService: ServiceTypeService, private messageService: MessageService, private modalService: NgbModal) { }
  

   ngOnInit() {
    this.getAllServiceType();
    //this.downloadCols = this.cols;
    for (let i = 0; i < this.cols.length; i++) {
      this.downloadCols.push(this.cols[i].header);
      //this.downloadCols[this.cols[i].header] = "";
    }
    
    console.log("im in ngonit");
    this.serviceTypeService.getAllSegmentData()
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


    this.serviceTypeService.getAllCountryData().subscribe(
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

    this.serviceTypeService.getBillingBasisData().subscribe(
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

  getServicetype() {
    this.errorMessage = "";
    this.msgs = [];
    if (this.gcbDetailFilters.productId != "Select" && this.gcbDetailFilters.countryCode != "Select") {
      let productData = this.productReferenceData.filter(x => x.productId == this.gcbDetailFilters.productId)[0];
      console.log("Product Selected : " + productData);
      this.gcbDetailFilters.suggestedServiceType = productData.serviceTypePrefix + this.gcbDetailFilters.countryCode;
      console.log("Product this.gcbDetailFilters.suggestedServiceType : " + this.gcbDetailFilters.suggestedServiceType);
      this.gcbDetailFilters.serviceType = this.gcbDetailFilters.suggestedServiceType;
      this.serviceTypeService.getServicetype(this.gcbDetailFilters).subscribe(
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
        this.serviceTypeService.upsertServiceType(this.gcbDetailFilters).subscribe(
          refData => {
            this.saveMessage = refData;
            //this.errorMessage = this.saveMessage.statusMessage;
           /*  this.msgs = [];
            this.msgs.push({ severity: 'error', summary: this.errorMessage, detail: '' }); */
            this.popupErrorMessage =  this.saveMessage.statusMessage;
            this.open(this.errorMessagePopUp);
            this.getAllServiceType();
          },
          error => {
          });
      }
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

  validation() {
    if (this.gcbDetailFilters.productId == "Select") {
      this.errorMessage = "Please select Product Name";
   /*    this.msgs = [];
      this.msgs.push({ severity: 'error', summary: this.errorMessage, detail: 'Validation failed' });
      this.messageService.add({ key: 'msgs1', severity: 'error', summary: this.errorMessage, detail: 'Detail Text' }); */

      return false;
    }
    if (this.gcbDetailFilters.countryCode == "Select") {
      this.errorMessage = "Please select Country Code";
     /*  this.msgs = [];
      this.msgs.push({ severity: 'error', summary: this.errorMessage, detail: 'Validation failed' }); */
      return false;
    }
    if (this.gcbDetailFilters.billingBasis == "Select") {
      this.errorMessage = "Please select Billing Basis";
    /*   this.msgs = [];
      this.msgs.push({ severity: 'error', summary: this.errorMessage, detail: 'Validation failed' }); */
      return false;
    }
    return true;
  }
  getAllServiceType() {
    console.log("getAllServiceType");
    this.serviceTypeService.getServicetypeData().subscribe(
      refData => {
        this.serviceTypes = refData;
        this.gcbDwnData = refData;
      },
      error => {
      });
      
  }
  clearAllFilters() {
    this.errorMessage = "";
   /*  this.messageService.clear();
    this.msgs = []; */
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
    this.popupErrorMessage = "";
  }

  showSelectedData(serviceTypeId) {
    console.log("radio button click" + serviceTypeId);
    this.editFlag = true;
    this.gcbDetailFilters = this.serviceTypes.filter(x => x.serviceTypeId == serviceTypeId)[0];
  }

}
