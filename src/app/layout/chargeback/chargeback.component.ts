import { Component, OnInit ,ViewChild} from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ChargebackService } from './chargeback.service';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants, UrlConstants } from '../../shared/constants/app.constants';
import { environment } from 'src/environments/environment.prod';
import { Router, ActivatedRoute } from '@angular/router';

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
  public focusGroupForCB: any;
  public focusGroupForCBList=[];
  public legalEntityReferenceData: any;
  public currencyReferenceData: any;
  currencyDataList: SelectItem[] = [];
  public billingModelReferenceData: any;
  billingModelDataList: SelectItem[] = [];
  mainBillingModelDataList: SelectItem[] = [];
  countryDataList: SelectItem[] = [];
  public countryReferenceData:any;
  public collapsed=true;
  public panelExpansionFlag=true;
  public costCenterData:any;
  gridLoadFlag = false;
  public costCenter:"";
  //public cloneFlag : boolean = false;
  chargeBackData: any = [];
  public chargeBackList: any = {
    vendorList : [],
    serviceTypeList: [],
	  legalEntityLst: [],
	  focusGroupLst: []
  }
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
    mode:"TESTING",
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
    suggestedCostCenterDefault:"",
    cloneFlag : false
  };
  public vscDtoObj: any = {
    vendorEntityId:"Select",
    productId: 0,
    vendorServiceCountryId: 0,
    serviceTypeName:"",
    suggestedCostCenterDefault:"",
  };
  public fileName : any ="CB";
  public downloadCols = [];

 // public  foundInSystemId =  "19";
  //public regKey = "587b99c1-7daf-4038-8ffb-de75dd165a0c";
  //public entityTypeID = "14";
  //chargeback external sys values
  public  foundInSystemId =  "11";
  public regKey = "8c8606d1-e591-435f-a435-d112ba4cd43c";
  public entityTypeID = "5";
  public cloneBillRef = false;

  constructor(private chargebackService: ChargebackService, private messageService: MessageService, private modalService: NgbModal,private route: ActivatedRoute) {
    if (this.route.snapshot.params['vendorSrCtryId']) {
      let vendorSrCtryId = parseInt(this.route.snapshot.paramMap.get('vendorSrCtryId'));
      console.log('vendorSrCtryId = '+vendorSrCtryId);
      this.chargebackService.getVSCData(vendorSrCtryId).subscribe(
        refData => {
         this.vscDtoObj = refData;
         this.showSelectedData("0",this.vscDtoObj.vendorEntityId,this.vscDtoObj.productId,this.vscDtoObj.vendorServiceCountryId);
      },
      error => {
      });
      this.expandAllPanels();
      window.scrollTo(0, 0);

    }

   }

  public cols = [
    { field: 'internalCbId', header: 'ChargeBack ID', width: '5%' },
    { field: 'vendorBanId', header: 'Vendor BAN', width: '10%' },
    { field: 'vendorName', header: 'Vendor', width: '10%' },
    { field: 'productName', header: 'Product', width: '10%' },
    { field: 'serviceType', header: 'Service Type', width: '10%' },
    { field: 'suggestedCostCenterDefault', header: 'Suggested Cost Center', width: '10%' },
    { field: 'createdBy', header: 'Created By', width: '10%' },
    { field: 'createdDateStr', header: 'Created Date', width: '10%' },
    { field: 'updatedBy', header: 'Updated By', width: '10%' },
    { field: 'lastUpdatedDateStr', header: 'Updated Date', width: '10%' },

  ];

  ngOnInit() { 
    for (let i = 0; i < this.cols.length; i++) {
      this.downloadCols.push(this.cols[i].header);
      //this.downloadCols[this.cols[i].header] = "";
    }   
    this.chargebackService.getProductData().subscribe(
          refData => {
            let arr: any = [];
            this.productReferenceData = refData;
            for (let data of this.productReferenceData) {
              let labelProd = data.serviceTypePrefix + " | " + data.productName
              this.productDataList.push({ label: labelProd, value: data.productId })
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

            // this.chargebackService.getLegalEntityData().subscribe(
            //   refData => {
            //     let arr: any = [];
        
            //     this.legalEntityReferenceData = refData;
            //     // this.focusGroupDataList.push({ label: "Select", value: "Select" })
                 
            //     for (let data of this.legalEntityReferenceData) {
            //       let labelLegalEntity = data.goldnetId + " | " + data.legalEntityName;
            //       this.legalEntityDataList.push({ label: labelLegalEntity, value: data.goldnetId })
            //     }
            //   },
            //   error => {
            //   });

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
                  this.mainBillingModelDataList = this.billingModelDataList;
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
                      this.gridLoadFlag = true;
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
          alert("No Service Type availabe for this combination. Please add one using the Create Vendor-Service-Country feature.");
        }
      },
      error => {
      });
  }
  getCostCenter(event){    
    this.chargebackService.getCostCenter(event.value,this.chargeBackFilters.productId,this.chargeBackFilters.vendorId).subscribe(
      refData => {
        let arr: any = [];
        this.costCenterData = refData;
        for (let data of this.costCenterData) {
          this.chargeBackFilters.costCenter=data.suggestedCostCenterDefault;
          this.chargeBackFilters.suggestedCostCenterDefault=data.suggestedCostCenterDefault;
          this.chargeBackFilters.suggestedCostCenter=data.suggestedCostCenterDefault;
          this.chargeBackFilters.vendorServiceCountryId=data.vendorServiceCountryId;         
        }
        this.getLegalEntities(this.chargeBackFilters.vendorServiceCountryId);
      },
      error => {
      });
  }

  getLegalEntities(vscId){
    this.legalEntityReferenceData="";
    this.legalEntityDataList=[];
  this.chargebackService.getLegalEntityData(vscId).subscribe(
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
      debugger;
      if (this.chargeBackFilters.cloneFlag){
        this.chargeBackFilters.cloneOfId = this.chargeBackFilters.internalCbId;
        this.chargeBackFilters.internalCbId = "";
      }
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
          this.errorMessage = "Please Enter BUC/ADN details";
          this.popupErrorMessage = "Please Enter BUC/ADN details";
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
  
              if(!this.chargeBackFilters.internalCbId && this.saveMessage.status)
              {
                //this.chargeBackFilters.internalCbId = this.saveMessage.internalCbId;
                this.associateBillRefToAsset(this.saveMessage.internalCbId);
              }
              if(this.saveMessage.status){ 
             this.clearAllFilters();
              }
            },
            error => {
              this.popupErrorMessage = AppConstants.ERROR_INTERNAL_SERVER;  
              this.open(this.errorMessagePopUp);
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

    this.gridLoadFlag = false;
    this.chargebackService.getChargeBackData().subscribe(
      refData => {
        this.chargeBackData=refData;
        this.gridLoadFlag = true;
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
      this.errorMessage = "Please Click on Enter BUC/Adn";
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

  showSelectedData(internalCbId,vendorId,productId,vscId) {   
    //debugger;
    this.expandAllPanels();
    window.scrollTo(0, 0);
    this.vendorEntityDataList=[];
    this.vendorEntityReferenceData="";
    this.serviceTypeDataList=[];
    this.serviceTypeReferenceData="";
    this.chargeBackFilters.vendorServiceCountryId=vscId;
    if(internalCbId!=null && internalCbId!="0"){
    this.editFlag = true;
    }
    else{
      this.editFlag = false;
    }
    this.legalEntityReferenceData="";
    this.legalEntityDataList=[];
    this.focusGroupForCB="";
    this.focusGroupForCBList=[];
    
     var dataLoadFlag=false; 
   
	 //this.cloneFlag = false;
     this.billingModelDataList = this.mainBillingModelDataList;

      this.chargebackService.setDropdownData(internalCbId,vendorId,productId,vscId).subscribe(
       refData => {
        //this.chargeBackList = refData;
        this.vendorEntityReferenceData = this.chargebackService.getVendorData();
        this.serviceTypeReferenceData = this.chargebackService.getServiceTypeData1();
        this.legalEntityReferenceData = this.chargebackService.getLegalEntityData1();
        this.focusGroupForCB = this.chargebackService.getFocusGroupData1();
        for (let data of this.vendorEntityReferenceData) {
          this.vendorEntityDataList.push({ label: data.vendorLegacyName, value: data.vendorEntityId })
        }
        for (let data of this.serviceTypeReferenceData) {
          if(data.serviceTypeName!=null){
          this.serviceTypeDataList.push({ label: data.serviceTypeName, value: data.serviceTypeName })
          }
        }  
        for (let data of this.legalEntityReferenceData) {
          let labelLegalEntity = data.goldnetId + " | " + data.legalEntityName;
          this.legalEntityDataList.push({ label: labelLegalEntity, value: data.goldnetId })
        }
        for (let data of this.focusGroupForCB) {
          this.focusGroupForCBList.push(data.focusGroupId)
        } 

        if(internalCbId!=null && internalCbId!="0"){
          this.chargeBackFilters = this.chargeBackData.filter(x => x.internalCbId == internalCbId)[0];
          this.chargeBackFilters.focusGroup=this.focusGroupForCBList;
          //this.getLegalEntities(vscId);
          }
          else{
            this.chargeBackFilters.productId = productId;
            this.chargeBackFilters.vendorId = vendorId;
            this.chargeBackFilters.suggestedCostCenterDefault = this.vscDtoObj.suggestedCostCenterDefault;
            this.chargeBackFilters.serviceType = this.vscDtoObj.serviceTypeName;
          }

          /* if(this.chargeBackFilters.cloneOfId!=null){
            this.chargeBackFilters.cloneFlag = true;
           }else{
            this.chargeBackFilters.cloneFlag = false;
           } */
          if(this.chargeBackFilters.overrideOffsetCostCenter==true){
            this.chargeBackFilters.costCenter=this.chargeBackFilters.suggestedCostCenter
          }else{
            this.chargeBackFilters.costCenter=this.chargeBackFilters.suggestedCostCenterDefault
          }

       },
       error => {
       });

    //  this.chargebackService.getVendorEntityData(productId).subscribe(
    //   refData => {
    //     let arr: any = [];  
    //     this.vendorEntityDataList=[];
    //     this.serviceTypeDataList=[];
    //     this.vendorEntityReferenceData = refData;  
    //     for (let data of this.vendorEntityReferenceData) {
    //       this.vendorEntityDataList.push({ label: data.vendorLegacyName, value: data.vendorEntityId })
    //     }
    //     // this.chargeBackFilters = this.chargeBackData.filter(x => x.internalCbId == internalCbId)[0];
    //      this.chargebackService.getServiceTypeData(productId,vendorId).subscribe(
    //       refData => {
    //         let arr: any = [];
    //         this.serviceTypeDataList=[];
    //         this.serviceTypeReferenceData = refData;
    //         for (let data of this.serviceTypeReferenceData) {
    //           if(data.serviceTypeName!=null){
    //           this.serviceTypeDataList.push({ label: data.serviceTypeName, value: data.serviceTypeName })
    //           }
    //         }  
            

    //         this.legalEntityReferenceData="";
    //         this.legalEntityDataList=[];
    //         this.chargebackService.getLegalEntityData(vscId).subscribe(
    //           refData => {
    //             let arr: any = [];          
    //             this.legalEntityReferenceData = refData;                 
    //             for (let data of this.legalEntityReferenceData) {
    //               let labelLegalEntity = data.goldnetId + " | " + data.legalEntityName;
    //               this.legalEntityDataList.push({ label: labelLegalEntity, value: data.goldnetId })
    //             }
    //             this.focusGroupForCB="";
    //             this.focusGroupForCBList=[];
    //             this.chargebackService.getFocusGroupDataId(internalCbId).subscribe(
    //               refData => {
    //                 let arr: any = [];          
    //                 this.focusGroupForCB = refData;
    //                 for (let data of this.focusGroupForCB) {
    //                   this.focusGroupForCBList.push(data.focusGroupId)
    //                 }                 
                    

    //         if(internalCbId!=null){
    //         this.chargeBackFilters = this.chargeBackData.filter(x => x.internalCbId == internalCbId)[0];
    //         this.chargeBackFilters.focusGroup=this.focusGroupForCBList;
    //         }
    //         else{
    //           this.chargeBackFilters.productId = productId;
    //           this.chargeBackFilters.vendorId = vendorId;
    //         }
    //         //this.chargeBackFilters.focusGroup={"3","5"};
    //         if(this.chargeBackFilters.cloneOfId!=null){
    //           this.chargeBackFilters.cloneFlag = true;
    //          }else{
    //           this.chargeBackFilters.cloneFlag = false;
    //          }
    //         if(this.chargeBackFilters.overrideOffsetCostCenter==true){
    //           this.chargeBackFilters.costCenter=this.chargeBackFilters.suggestedCostCenter
    //         }else{
    //           this.chargeBackFilters.costCenter=this.chargeBackFilters.suggestedCostCenterDefault
    //         }
    //       },
    //       error => {
    //       });
    //          },
    //       error => {
    //       });

    //     },
    //     error => {
    //     });
        
    //     },
    //   error => {        

    //   });
        
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
        if(this.cloneBillRef){
          this.cloneBillRef = false;
        }
        this.editBillRef();
      } 
    },
    error => {
   this.popupErrorMessage = AppConstants.ERROR_INTERNAL_SERVER;
   this.open(this.errorMessagePopUp);
    });
}
 
 
cancel(){
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
    mode:"TESTING",
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
    cloneFlag : false
  };
  this.legalEntityDataList=[];
  //this.cloneFlag = false;
}

clearAllFilters(){
  this.editFlag = false;
 // this.popupErrorMessage = "";
 // this.errorMessage = "";
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
    mode:"TESTING",
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
    cloneFlag : false
  };
  this.legalEntityDataList=[];
  //this.cloneFlag = false;
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
        this.errorMessage = "Please Enter BUC/ADN details";
        this.popupErrorMessage = "Please Enter BUC/ADN details";
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



associateBillRefToAsset(internalCbId){

  this.chargebackService.associateBillReftoAsset(this.chargeBackFilters.billroutingId,
    internalCbId, this.regKey).subscribe(
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
   window.open( environment.APP_BILLHUB_URL_UI_ENDPOINT + 
    "/EditBillReference;billRefId="+
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
checkCostCenter(){
  if(this.chargeBackFilters.overrideOffsetCostCenter==true){
    this.chargeBackFilters.costCenter=this.chargeBackFilters.suggestedCostCenter
  }else{
    this.chargeBackFilters.costCenter=this.chargeBackFilters.suggestedCostCenterDefault
  }
}

cloneRecord(){
  if(this.chargeBackFilters.cloneFlag){
    console.log("Clone flag is "+this.chargeBackFilters.cloneFlag);
     this.billingModelDataList =[];
    let cbId = this.chargeBackFilters.internalCbId;
    this.cloneBillRef = true;
    this.chargebackService.getCloneBillingModel(cbId).subscribe(
      refData => {
        debugger;
        let arr: any = [];
        debugger;
        this.billingModelDataList =[];
        this.billingModelReferenceData = refData;          
        for (let data of this.billingModelReferenceData) {
          this.billingModelDataList.push({ label: data.billingModelDesc, value: data.billingModelId })
        }
      },
      error => {
      });
      this.chargeBackFilters.mode = "TESTING";
      this.popupErrorMessage = "Do you want to use the same buc/adn details for the Clone?";
      this.open(this.errorMessagePopUp);
  }else{
    this.billingModelDataList = this.mainBillingModelDataList;
    this.cloneBillRef = false;
  }
}

  checkServiceType(){
    console.log("test");
    if(this.chargeBackFilters.serviceType=="" || this.chargeBackFilters.serviceType=="Select"){
      this.popupErrorMessage = "Please select the Service Type first.";
      this.open(this.errorMessagePopUp);
    }
  }

  cloneBillRefRec(flag){
    this.cloneBillRef = flag;
    debugger;
    if(flag){
      this.chargeBackFilters.billroutingId="";
      this.generateBillRefId();
    }
    else{
      this.duplicateBillRef();
      //this.upsertChargeBack();
    }
  }
  
  duplicateBillRef(){
    let billRef = this.chargeBackFilters.billroutingId;
    let sso = 999999999;
    let process = "Chargeback : CBId-"+this.chargeBackFilters.internalCbId+" BillRef-"+billRef;
    this.chargebackService.duplicateBillRefId(billRef, this.regKey, sso,process).subscribe(
      refData => {
        debugger;
        let response = refData;
        let respArray = [];
        respArray.push(response);
        if (respArray[0].OUTPUT=="SUCCESS") {
          this.chargeBackFilters.billroutingId = respArray[0].BillRefID[0];
          this.cloneBillRef = false;
        }
        else{
          this.popupErrorMessage = respArray[0].message;
          this.open(this.errorMessagePopUp);
        }
      },
      (error) => {
        this.popupErrorMessage = error;
        this.open(this.errorMessagePopUp);
      });
  

  }
}

