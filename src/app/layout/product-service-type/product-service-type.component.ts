import { Component, OnInit,  ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { ProductServiceTypeService } from './product-service-type.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-service-type',
  templateUrl: './product-service-type.component.html',
  styleUrls: ['./product-service-type.component.scss'],
  providers: [ProductServiceTypeService, MessageService]

})
export class ProductServiceTypeComponent implements OnInit {
  public serviceTypes: any = [];
  productReferenceDataList: SelectItem[] = [];
  public productReferenceData: any;
  countryCodeReferenceDataList: SelectItem[] = [];
  public countryCodeReferenceData: any;
  billingReferenceDataList: SelectItem[] = [];
  public billingBasisReferenceData: any;
  public gcbDwnData: any = [];
  public downloadCols = [];
  public fileName : any ="ServiceType";

  public billProcessReference: any;
  public legacyServiceTypeEnableFlag:boolean=false;
  public gcbDetailFilters: any = {
    productId: "Select",
    productNm:"",
    billedFromLocationId: "Select",
    billedToLocationId: "Select",
    billingBasis: "Select",
    serviceTypeName: "",
    suggestedServiceType: "",
    serviceTypeMessage: "",
    useSuggested: true,
    vatPercent :"",
    whtPercent :"",
    tpPercent :"",
    unspscOverride :false,
    unspsc: "",
    costCenter: "",
    legacyServiceTypeName:"",
    processName:""
  };
  public cols = [
    { field: 'productNm', header: 'Product Name', width: '15%' },
    { field: 'serviceTypeName', header: 'Service Type Name', width: '15%' },
    { field: 'legacyServiceTypeName', header: 'Legacy ST Name', width: '15%' },
    { field: 'billedFromLocation', header: 'Billed From Country', width: '15%' },
    { field: 'billedToLocation', header: 'Billed To Country', width: '15%' },
    { field: 'costCenter', header: 'Cost Center', width: '15%' },
    { field: 'updatedBy', header: 'Updated By', width: '10%' },
    { field: 'lastUpdated', header: 'Updated Date', width: '10%' },
  

  ];
  public editFlag = false;
  public formMode="New";
  public errorMessage = "";
  public saveMessage: any = [];
  @ViewChild('content1') errorMessagePopUp;
  public popupErrorMessage: any;
  closeResult: string;
  constructor(private serviceTypeService: ProductServiceTypeService, private modalService: NgbModal) { }

  ngOnInit() {
    for (let i = 0; i < this.cols.length; i++) {
      this.downloadCols.push(this.cols[i].header);
      //this.downloadCols[this.cols[i].header] = "";
    }
    this.getAllServiceType();
    this.getAllProductData();
    this.getAllCountryData();
    this.getBillingBasisData();
    this.getBillProcess()
  }


 getAllCountryData(){
    this.serviceTypeService.getCountryData().subscribe(
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

  getAllProductData(){
    this.serviceTypeService.getProducts()
    .subscribe(
    refData => {
      let arr: any = [];
      this.productReferenceData = refData;
      this.productReferenceDataList.push({ label: "Select", value: "Select" })
      for (let data of this.productReferenceData) {
        let labelProd = data.productCode + " | " + data.productName
        this.productReferenceDataList.push({ label: labelProd, value: data.productId })

      }
    },
    error => {
      console.log(error);
    });

  }

  getBillingBasisData(){
    /*this.serviceTypeService.getBillingBasis().subscribe(
      refData => {
        let arr: any = [];

        this.billingBasisReferenceData = refData;
        this.billingReferenceDataList.push({ label: "Select", value: "Select" })

        for (let data of this.billingBasisReferenceData) {
          this.billingReferenceDataList.push({ label: data.billbasisname, value: data.billbasisname })
        }
      },
      error => {
      });*/
      this.billingReferenceDataList.push({ label: "Select", value: "Select" });
      this.billingReferenceDataList.push({ label: "ACCOUNT-BASED", value: "ACCOUNT-BASED" });
      this.billingReferenceDataList.push({ label: "SSO-BASED", value: "SSO-BASED" });
  }
  getBillProcess(){
    this.serviceTypeService.getBillProcessList().subscribe(
      refData => {
        this.billProcessReference = refData;       
      },
      error => {
      });
    }

  getServicetype() {
    this.errorMessage = "";
    if (this.gcbDetailFilters.productId != "Select") {
      let productData = this.productReferenceData.filter(x => x.productId == this.gcbDetailFilters.productId)[0];
      let billProcessData=this.billProcessReference.filter(y => y.billProcessId == productData.billProcessId)[0];
      this.gcbDetailFilters.unspsc = productData.unspsc; 
      this.gcbDetailFilters.processName=billProcessData.processName;
      if(this.gcbDetailFilters.processName=='GOTEMS'){
        this.legacyServiceTypeEnableFlag=true;
      }     
    }
    if (this.gcbDetailFilters.productId != "Select" && this.gcbDetailFilters.billedFromLocationId != "Select" && this.gcbDetailFilters.billedToLocationId != "Select") {
      let productData = this.productReferenceData.filter(x => x.productId == this.gcbDetailFilters.productId)[0];
      console.log("Product Selected : " + productData);
      let fromCountry =  this.countryCodeReferenceData.filter(x => x.countryId == this.gcbDetailFilters.billedFromLocationId)[0];
      let toCountry =  this.countryCodeReferenceData.filter(x => x.countryId == this.gcbDetailFilters.billedToLocationId)[0];
      this.gcbDetailFilters.serviceTypeName = productData.productCode +"_"+ fromCountry.countryCode+"_2"+toCountry.countryCode;
      console.log("Product this.gcbDetailFilters.suggestedServiceType : " + this.gcbDetailFilters.serviceType);
      this.gcbDetailFilters.suggestedServiceType = this.gcbDetailFilters.serviceTypeName;
      this.gcbDetailFilters.legacyServiceTypeName=this.gcbDetailFilters.serviceTypeName;
      if(this.gcbDetailFilters.processName=='TELECOM'){
        this.legacyServiceTypeEnableFlag=false;
      }       
    
    }

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

  upsertServiceType() {
    this.errorMessage = "";
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
            if(this.saveMessage.status){
              this.clearAllFilters();
            }
          },
          error => {
          });
      }
    }
  }

  validation() {
    if (this.gcbDetailFilters.productId == "Select") {
      this.errorMessage = "Please select Product Name";
      return false;
    }
    if (this.gcbDetailFilters.billedFromLocationId == "Select") {
      this.errorMessage = "Please select from Country ";
      return false;
    }
    if (this.gcbDetailFilters.billedToLocationId == "Select") {
      this.errorMessage = "Please select to Country ";
      return false;
    }
    if (this.gcbDetailFilters.billingBasis == "Select") {
      this.errorMessage = "Please select Billing Basis";
       return false;
    }
    if (this.gcbDetailFilters.costCenter == "") {
      this.errorMessage = "Please select Cost Center";
       return false;
    }
    if (this.gcbDetailFilters.billingBasis == "Select") {
      this.errorMessage = "Please select Cost Center";
       return false;
    }
    return true;
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

  clearAllFilters() {
    this.errorMessage = "";
   /*  this.messageService.clear();
    this.msgs = []; */
    this.editFlag = false;
    this.gcbDetailFilters = {
      productId: "Select",
      productNm:"",
      billedFromLocationId: "Select",
      billedToLocationId: "Select",
      billingBasis: "Select",
      serviceTypeName: "",
      suggestedServiceType: "",
      serviceTypeMessage: "",
      useSuggested: true,
      vatPercent :"",
      whtPercent :"",
      tpPercent :"",
      unspscOver :"",
      unspscOverride :false,
      costCenter: ""  ,
      processName:""  
    };
  }

  showSelectedData(serviceTypeId) {
    console.log("radio button click" + serviceTypeId);
    this.editFlag = true;
    this.gcbDetailFilters = this.serviceTypes.filter(x => x.serviceTypeId == serviceTypeId)[0];
    this.formMode="Modify";

    if(this.gcbDetailFilters.processName=='TELECOM'){
      this.legacyServiceTypeEnableFlag=false;
      // if(this.gcbDetailFilters.legacyServiceTypeName=="" || this.gcbDetailFilters.legacyServiceTypeName==null){
      // this.gcbDetailFilters.legacyServiceTypeName=this.gcbDetailFilters.serviceTypeName;
      // }
    } 
    
  }
} 
