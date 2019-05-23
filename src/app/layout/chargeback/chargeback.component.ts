import { Component, OnInit ,ViewChild} from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ChargebackService } from './chargeback.service';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants, UrlConstants } from '../../shared/constants/app.constants';

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
public index = [];
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
    vendorServiceCountryId:0,
    vendorName: "Select",
    productName: "Select",
    productId:0,
    vendorId:0,
    serviceType: "Select",
    suggestedCostCenter: "",
    overrideOffsetCostCenter: false,
    // serviceTypeName: "",
    goldnetId:0,
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
    cloneOfId:"",
    suggestedCostCenterDefault:""
  };


  public  foundInSystemId =  "19";
  public regKey = "587b99c1-7daf-4038-8ffb-de75dd165a0c";
  public entityTypeID = "14";
  constructor(private chargebackService: ChargebackService, private messageService: MessageService, private modalService: NgbModal) { }

  public cols = [
    { field: 'internalCbId', header: 'ChargeBack ID', width: '5%' },
    { field: 'vendorBanId', header: 'Vendor BAN', width: '10%' },
    { field: 'vendorName', header: 'Vendor', width: '10%' },
    { field: 'productName', header: 'Product', width: '10%' },
    { field: 'serviceType', header: 'Service Type', width: '10%' },
    { field: 'suggestedCostCenterDefault', header: 'Suggested Cost Center', width: '10%' },
    { field: 'createdBy', header: 'Created By', width: '10%' },
    { field: 'createdDate', header: 'Created Date', width: '10%' },
    { field: 'updatedBy', header: 'Updated By', width: '10%' },
    { field: 'lastUpdatedDate', header: 'Updated Date', width: '10%' },

  ];

  ngOnInit() { 
        
    this.chargebackService.getProductData().subscribe(
          refData => {
            let arr: any = [];
            this.productReferenceData = refData;
            for (let data of this.productReferenceData) {
              this.productDataList.push({ label: data.productName, value: data.productId })
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
                  let labelLegalEntity = data.goldnetId + " | " + data.legalEntityName;
                  this.legalEntityDataList.push({ label: labelLegalEntity, value: data.goldnetId })
                }
              },
              error => {
              });

            this.chargebackService.getCurrencyData().subscribe(
              refData => {
                let arr: any = [];
        
                this.currencyReferenceData = refData;        
                for (let data of this.currencyReferenceData) {
                  let labelCurrency = data.currencyCode + " | " + data.currencyDescription;
                  this.currencyDataList.push({ label: labelCurrency, value: data.currencyCode })
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

  getVendorLst(event){
    this.vendorEntityDataList=[];
    this.serviceTypeDataList=[];
    this.chargeBackFilters.suggestedCostCenterDefault="";
    this.chargebackService.getVendorEntityData(event.value).subscribe(
      refData => {
        let arr: any = [];  
        this.vendorEntityReferenceData = refData;  
        for (let data of this.vendorEntityReferenceData) {
          this.vendorEntityDataList.push({ label: data.vendorLegacyName, value: data.vendorEntityId })
        }
      },
      error => {        

      });   
  }
  getServiceType(event){
   this.serviceTypeDataList=[];
    this.chargebackService.getServiceTypeData(this.chargeBackFilters.productId,event.value).subscribe(
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
          this.chargeBackFilters.suggestedCostCenterDefault=data.suggestedCostCenterDefault;
          this.chargeBackFilters.vendorServiceCountryId=data.vendorServiceCountryId;
        }
      },
      error => {
      });
  }

  expandAllPanels(){
    this.index = [0,1,2,3,4];
    this.collapsed=false;
    this.panelExpansionFlag=false;
  }

  collapseAllPanels(){
    this.index = [];
    this.collapsed=true;
    this.panelExpansionFlag=true;
  }

  upsertChargeBack() {
    this.errorMessage = "";
    this.msgs = [];
    console.log("test button click",this.chargeBackFilters);
    if (this.validation()) {

      this.chargebackService.getBillRefIDTokensAssociated(this.chargeBackFilters.billroutingId,
        this.regKey).subscribe(
      refData => {
        let response = refData;
        let respArray = [];
        respArray.push(response);
        console.log(response);
        if (respArray[0].message === "No Tokens Associated") {
          this.errorMessage = respArray[0].message;
          this.popupErrorMessage = respArray[0].message;
          this.open(this.errorMessagePopUp);
          
        }
        else   if (respArray[0].message === "BillRef does not exist"){
          this.errorMessage = "BillRouting ID does not exist. Please generate a new one ";
          this.popupErrorMessage = "BillRouting ID does not exist. Please generate a new one ";
          this.chargeBackFilters.billroutingId = "";
          this.chargeBackFilters.billroutingId = "";
          this.open(this.errorMessagePopUp);
         
        }
        else {
          this.chargebackService.upsertChargeBack(this.chargeBackFilters).subscribe(
            refData => {
              this.saveMessage = refData;
              this.errorMessage = this.saveMessage.statusMessage;
              this.msgs = [];
              this.msgs.push({ severity: 'error', summary: this.errorMessage, detail: '' });
              this.popupErrorMessage =  this.saveMessage.statusMessage;
              this.open(this.errorMessagePopUp);
              this.getChargeBackData();
  
              if(!this.chargeBackFilters.internalCbId)
              {
                this.chargeBackFilters.internalCbId = this.saveMessage.internalCbId;
                this.associateBillRefToAsset();
              }
  
            },
            error => {
            });

        }
      },
      (error) => {
        this.popupErrorMessage = error;  
        this.open(this.errorMessagePopUp);
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
    if(this.chargeBackFilters.vendorBanId==""){
      this.errorMessage = "Please Enter Vendor BAN ID";
      return false;
    }
    if(this.chargeBackFilters.vendorId==0){
      this.errorMessage = "Please Select Vendor";
      return false;
    }
    if(this.chargeBackFilters.productId==0){
      this.errorMessage = "Please Select Product";
      return false;
    }
    if(this.chargeBackFilters.serviceType==""){
      this.errorMessage = "Please Select Service Type";
      return false;
    }
    if(this.chargeBackFilters.goldnetId==0){
      this.errorMessage = "Please Select Legal Entity Name";
      return false;
    }
    if(this.chargeBackFilters.focusGroup==""){
      this.errorMessage = "Please Select Focus Group";
      return false;
    }
    if(this.chargeBackFilters.billroutingId==""){
      this.errorMessage = "Please Click on Generate Bill Routing ID";
      return false;
    }
    if(this.chargeBackFilters.billingModel==""){
      this.errorMessage = "Please Select Billing Model";
      return false;
    }
    if(this.chargeBackFilters.mode==""){
      this.errorMessage = "Please Select Mode";
      return false;
    }
    if(this.chargeBackFilters.currencyCode==""){
      this.errorMessage = "Please Select Currency Code";
      return false;
    }
   /*  if(this.chargeBackFilters.billroutingId)
    {
   
      return this.checkBillRefIDTokensAssociated();
    } */

    return true;
  }

  showSelectedData(internalCbId,vendorId,productId) {   
    this.vendorEntityDataList=[];
    this.serviceTypeDataList=[];
    this.editFlag = true;
     var dataLoadFlag=false;

     this.chargebackService.getVendorEntityData(productId).subscribe(
      refData => {
        let arr: any = [];  
        this.vendorEntityReferenceData = refData;  
        for (let data of this.vendorEntityReferenceData) {
          this.vendorEntityDataList.push({ label: data.vendorLegacyName, value: data.vendorEntityId })
        }
         this.chargeBackFilters = this.chargeBackData.filter(x => x.internalCbId == internalCbId)[0];
      },
      error => {        

      });
       
      this.chargebackService.getServiceTypeData(productId,vendorId).subscribe(
        refData => {
          let arr: any = [];
          this.serviceTypeReferenceData = refData;
          for (let data of this.serviceTypeReferenceData) {
            if(data.serviceTypeName!=null){
            this.serviceTypeDataList.push({ label: data.serviceTypeName, value: data.serviceTypeName })
            }
          }  
          this.chargeBackFilters = this.chargeBackData.filter(x => x.internalCbId == internalCbId)[0];
           },
        error => {
        });
        
        //this.chargeBackFilters = this.chargeBackData.filter(x => x.internalCbId == internalCbId)[0];

}
generateBillRefId() {
 
  const requestorSSO =  "999999999"; //localStorage.getItem(AppConstants.LABEL_LOGGEDIN_SSO);

  this.chargebackService.getBillHubRefID(this.regKey, requestorSSO, this.entityTypeID).subscribe(
    refData => {
      let response = refData;
      let respArray = [];
      respArray.push(response);
      if (respArray[0].OUTPUT === 'FAIL')
      {
        this.popupErrorMessage = respArray[0].BillRefID;
        this.open(this.errorMessagePopUp);
      }
     else if (respArray[0].BillRefID) {
        this.chargeBackFilters.billroutingId = respArray[0].BillRefID;
        this.editBillRef();
      } 
    },
    error => {
   this.popupErrorMessage = AppConstants.ERROR_INTERNAL_SERVER;
   this.open(this.errorMessagePopUp);
    });
}
 
 
clearAllFilters(){
  this.editFlag = false;
  this.popupErrorMessage = "";
  this.errorMessage = "";
  if(!this.chargeBackFilters.internalCbId)
  {    
    if(this.chargeBackFilters.billroutingId)
    this.deleteBillRefIDWithNoTokens(this.chargeBackFilters.billroutingId);
  }
  this.chargeBackFilters= {
    vendorBanId:"",
    vendorServiceCountryId:0,
    vendorName: "Select",
    productName: "Select",
    productId:0,
    vendorId:0,
    serviceType: "Select",
    suggestedCostCenter: "",
    overrideOffsetCostCenter: false,
    // serviceTypeName: "",
    goldnetId:0,
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

}

checkBillRefIDTokensAssociated() : boolean {
  this.chargebackService.getBillRefIDTokensAssociated(this.chargeBackFilters.billroutingId,
      this.regKey).subscribe(
    refData => {
      let response = refData;
      let respArray = [];
      respArray.push(response);
      console.log(response);
      if (respArray[0].message === "No Tokens Associated") {
        this.errorMessage = respArray[0].message;
        this.popupErrorMessage = respArray[0].message;
        this.open(this.errorMessagePopUp);
        return false;
      }
      else   if (respArray[0].message === ""){
        return true;
      }
      else   if (respArray[0].message === "BillRef does not exist"){
        this.errorMessage = "BillRouting does not exist .Please generate a new one ";
        this.popupErrorMessage = "BillRouting does not exist .Please generate a new one ";
        this.chargeBackFilters.billroutingId = "";
        this.open(this.errorMessagePopUp);
        return false;
      }
      else return true;
    },
    (error) => {
      this.popupErrorMessage = error; return false;
      this.open(this.errorMessagePopUp);
    });
    return true;

}



associateBillRefToAsset(){

  this.chargebackService.associateBillReftoAsset(this.chargeBackFilters.billroutingId,
    this.chargeBackFilters.internalCbId, this.regKey).subscribe(
    refData => {
      let response = refData;
      let respArray = [];
      respArray.push(response);
      if (respArray[0].Successful_Count === 1) {

      }
      else {
        if (!(respArray[0].RecordsArray[0].message === "Bill Ref Already Associated.")) {
          this.popupErrorMessage = respArray[0].RecordsArray[0].message;
         //this.open(this.errorMessagePopUp);
        }
      }
    },
    (error) => {
      this.popupErrorMessage = error;
      this.open(this.errorMessagePopUp);
    });

}
deleteBillRefIDWithNoTokens(billroutingId)
{

 //delete if no tokens associated
  this.chargebackService.getBillRefIDTokensAssociated(billroutingId,
    this.regKey).subscribe(
  refData => {
    let response = refData;
    let respArray = [];
    respArray.push(response);
    if (respArray[0].message === "No Tokens Associated") {
      this.deleteBillRefID(billroutingId);
    }
    else {
     
    }
  },
  (error) => {
    this.popupErrorMessage = error;
    this.open(this.errorMessagePopUp);
  });

}

editBillRef(){

  let sso =999999999;
   window.open("http://stage-billhub.corporate.ge.com:8080/BillHub/index.html#/EditBillReference;billRefId="+
   this.chargeBackFilters.billroutingId+";sso="+sso+";mode=edit");
 
 }
deleteBillRefID(billroutingId){
 this.chargebackService.deleteBillRefbyId(billroutingId ).subscribe(
   refData => {
     let arr: any = [];
     //this.gridData = refData;
//    console.log(refData);

   },
   error => {
    this.popupErrorMessage = AppConstants.ERROR_INTERNAL_SERVER;
   });
}



}

