import { Component, OnInit ,ViewChild} from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ChargebackService } from './chargeback.service';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chargeback',
  templateUrl: './chargeback.component.html',
  styleUrls: ['./chargeback.component.scss'],
  providers: [MessageService]
})
export class ChargebackComponent implements OnInit {

  msgs: Message[] = [];
  public errorMessage = "";
  public saveMessage: any = [];

  @ViewChild('content1') errorMessagePopUp;
  public popupErrorMessage: any;
  closeResult: string;

  public editFlag = false;

  public expansionEventFlag = true;
  serviceTypeDataList: SelectItem[] = [];
  public serviceTypeReferenceData: any;
  vendorEntityDataList: SelectItem[] = [];
  public vendorEntityReferenceData: any;
  productDataList: SelectItem[] = [];
  public productReferenceData: any;
  focusGroupDataList: SelectItem[] = [];
  public focusGroupReferenceData: any;
  legalEntityDataList: SelectItem[] = [];
  public legalEntityReferenceData: any;
  public currencyReferenceData: any;
  currencyDataList: SelectItem[] = [];
  public billingModelReferenceData: any;
  billingModelDataList: SelectItem[] = [];
  countryDataList: SelectItem[] = [];
  public countryReferenceData:any;
  public collapsed=true;
  public panelExpansionFlag=true;
  public costCenterData:any;

  chargeBackData: any = [];
  public chargeBackFilters: any = {
    vendorBanId:"",
    vendorServiceCountryId:"",
    vendorName: "Select",
    productName: "Select",
    productId:"",
    vendorId:"",
    serviceType: "Select",
    costCenter: "",
    overrideOffsetCostCenter: false,
   // serviceTypeName: "",
   goldnetId: "",
   legalEntityId:"",
    focusGroup:"",
    division:false,
    billroutingId:"",
    billingModel:"",
    mode:"testing",
    currencyCode:"",
    directOffsetBuc:"",
    indirectOffsetBuc:"",
    vendorCode:"",
    shipFromAddress:"",
    shipToCountry:"",
    shipToProvince:"",
    shipToCity:"",
    shipToState:"",
    shipToZip4:"",
    shpToZip5:"",
    vendorContact:"",
    ouName:"",
    custRegNumber:"",
    globalSupplierNumber:"",
    siteNumber:"",
    sssProject:"",
    sssTask:"",
    awtGroupName:"",
    vatAwtGroupName:"",
    paymentTerms:"",
    cloneOfId:""
  };


  constructor(private chargebackService: ChargebackService, private messageService: MessageService, private modalService: NgbModal) { }

  public cols = [
    { field: 'internalCbId', header: 'ChargeBack ID', width: '5%' },
    { field: 'vendorBanId', header: 'Vendor BAN', width: '10%' },
    { field: 'vendorName', header: 'Vendor', width: '10%' },
    { field: 'productName', header: 'Product', width: '10%' },
    { field: 'serviceType', header: 'Service Type', width: '10%' },
    { field: 'costCenter', header: 'Suggested Cost Center', width: '10%' },
    { field: 'createdBy', header: 'Created By', width: '10%' },
    { field: 'createdDate', header: 'Created Date', width: '10%' },
    { field: 'updatedBy', header: 'Updated By', width: '10%' },
    { field: 'updatedDate', header: 'Updated Date', width: '10%' },

  ];

  ngOnInit() {   

      this.chargebackService.getVendorEntityData().subscribe(
        refData => {
          let arr: any = [];  
          this.vendorEntityReferenceData = refData;  
          for (let data of this.vendorEntityReferenceData) {
            this.vendorEntityDataList.push({ label: data.vendorLegalEntityName, value: data.vendorEntityId })
          }
        },
        error => {        

        });    
      
          this.chargebackService.getFocusGroupData().subscribe(
            refData => {
              let arr: any = [];
      
              this.focusGroupReferenceData = refData;
              // this.focusGroupDataList.push({ label: "Select", value: "Select" })
      
              for (let data of this.focusGroupReferenceData) {
                this.focusGroupDataList.push({ label: data.focusGroup, value: data.focusGroupId })
              }
            },
            error => {
            });

            this.chargebackService.getLegalEntityData().subscribe(
              refData => {
                let arr: any = [];
        
                this.legalEntityReferenceData = refData;
                // this.focusGroupDataList.push({ label: "Select", value: "Select" })
        
                for (let data of this.legalEntityReferenceData) {
                  this.legalEntityDataList.push({ label: data.legalEntityName, value: data.legalEntityId })
                }
              },
              error => {
              });

            this.chargebackService.getCurrencyData().subscribe(
              refData => {
                let arr: any = [];
        
                this.currencyReferenceData = refData;        
                for (let data of this.currencyReferenceData) {
                  this.currencyDataList.push({ label: data.currencyDescription, value: data.currencyCode })
                }
              },
              error => {
              });

              this.chargebackService.getBillingModelData().subscribe(
                refData => {
                  let arr: any = [];
          
                  this.billingModelReferenceData = refData;          
                  for (let data of this.billingModelReferenceData) {
                    this.billingModelDataList.push({ label: data.billingModelDesc, value: data.billingModelId })
                  }
                },
                error => {
                });

                this.chargebackService.getCountryData().subscribe(
                  refData => {
                    let arr: any = [];
            
                    this.countryReferenceData = refData;            
                    for (let data of this.countryReferenceData) {
                      let labelCountry = data.countryAbbreviation + " | " + data.countryName;
                      this.countryDataList.push({ label: labelCountry, value: data.countryAbbreviation })
                    }
                  },
                  error => {
                  });

                  this.chargebackService.getChargeBackData().subscribe(
                    refData => {
                      this.chargeBackData=refData;
                    },
                    error => {
                    });
                
  }

  getProductLst(event){
    this.productDataList=[];
    this.chargeBackFilters.costCenter="";
    this.serviceTypeDataList=[];
    this.chargebackService.getProductData(event.value).subscribe(
      refData => {
        let arr: any = [];
        this.productReferenceData = refData;
        for (let data of this.productReferenceData) {
          this.productDataList.push({ label: data.productName, value: data.productId })
        }
      },
      error => {
      });
  }
  getServiceType(event){
    this.serviceTypeDataList=[];
    this.chargeBackFilters.suggestedCostCenter="";
    this.chargebackService.getServiceTypeData(event.value,this.chargeBackFilters.vendorId).subscribe(
      refData => {
        let arr: any = [];
        this.serviceTypeReferenceData = refData;
        for (let data of this.serviceTypeReferenceData) {
          if(data.serviceTypeName!=null){
          this.serviceTypeDataList.push({ label: data.serviceTypeName, value: data.serviceTypeName })
          }
        }
        if(this.serviceTypeDataList.length==0){
          alert("Add Entry in VSC first");
        }
      },
      error => {
      });
  }
  getCostCenter(event){
    this.chargebackService.getCostCenter(event.value).subscribe(
      refData => {
        let arr: any = [];
        this.costCenterData = refData;
        for (let data of this.costCenterData) {
          this.chargeBackFilters.costCenter=data.suggestedCostCenterDefault;
          this.chargeBackFilters.vendorServiceCountryId=data.vendorServiceCountryId;
        }
      },
      error => {
      });
  }

  expandAllPanels(){
    this.collapsed=false;
    this.panelExpansionFlag=false;
  }

  collapseAllPanels(){
    this.collapsed=true;
    this.panelExpansionFlag=true;
  }

  upsertChargeBack() {
    this.errorMessage = "";
    this.msgs = [];
    console.log("test button click",this.chargeBackFilters);
    if (this.validation()) {
        this.chargebackService.upsertChargeBack(this.chargeBackFilters).subscribe(
          refData => {
            this.saveMessage = refData;
            this.errorMessage = this.saveMessage.statusMessage;
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: this.errorMessage, detail: '' });
            this.popupErrorMessage =  this.saveMessage.statusMessage;
            this.open(this.errorMessagePopUp);
            this.getChargeBackData();
          },
          error => {
          });
     
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

  getChargeBackData(){
    this.chargebackService.getChargeBackData().subscribe(
      refData => {
        this.chargeBackData=refData;
      },
      error => {
      });
  }
  validation(){
    return true;
  }

  showSelectedData(internalCbId) {       
    this.productDataList=[];
    this.chargeBackFilters.costCenter="";
    this.serviceTypeDataList=[];
    console.log("radio button click" + internalCbId);

    this.editFlag = true;
    this.chargeBackFilters = this.chargeBackData.filter(x => x.internalCbId == internalCbId)[0];

    console.log(this.chargeBackFilters);

    this.chargebackService.getProductData(this.chargeBackFilters.vendorId).subscribe(
      refData => {
        let arr: any = [];
        this.productReferenceData = refData;
        for (let data of this.productReferenceData) {
          this.productDataList.push({ label: data.productName, value: data.productId })
        }
      },
      error => {
      });
      
     console.log(this.chargeBackFilters);

    // this.vendorEntityDataList.push({ label:this.chargeBackFilters.vendorName, value: this.chargeBackFilters.vendorId })
    //this.productDataList.push({ label:this.chargeBackFilters.productName, value: this.chargeBackFilters.productId })
    //this.serviceTypeDataList.push({ label:this.chargeBackFilters.serviceType, value: this.chargeBackFilters.serviceType })
}

}

