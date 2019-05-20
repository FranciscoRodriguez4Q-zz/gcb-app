import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ChargebackService } from './chargeback.service';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-chargeback',
  templateUrl: './chargeback.component.html',
  styleUrls: ['./chargeback.component.scss']
})
export class ChargebackComponent implements OnInit {

  msgs: Message[] = [];
  public errorMessage = "";
  public saveMessage: any = [];

  public expansionEventFlag = true;
  serviceTypeDataList: SelectItem[] = [];
  public serviceTypeReferenceData: any;
  vendorEntityDataList: SelectItem[] = [];
  public vendorEntityReferenceData: any;
  productDataList: SelectItem[] = [];
  public productReferenceData: any;
  focusGroupDataList: SelectItem[] = [];
  public focusGroupReferenceData: any;
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
    vendorBan:"",
    vendorServiceCountryId:"",
    vendor: "Select",
    product: "Select",
    serviceType: "Select",
    suggestedCostCenter: "",
    overrideOffsetCostCenter: false,
   // serviceTypeName: "",
    goldNetId: "",
    legalEntityName:"",
    focusGroup:"",
    division:false,
    billRoutingId:"",
    billingModel:"",
    mode:"testing",
    currencyCode:"",
    directOffsetBuc:"",
    inDirectOffsetBuc:"",
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
    project:"",
    task:"",
    awtGroupName:"",
    vatAwtGroupName:"",
    paymentTerms:""
  };


  constructor(private chargebackService: ChargebackService) { }

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

            this.chargebackService.getCurrencyData().subscribe(
              refData => {
                let arr: any = [];
        
                this.currencyReferenceData = refData;
                this.currencyDataList.push({ label: "Select", value: "Select" })
        
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
                  this.billingModelDataList.push({ label: "Select", value: "Select" })
          
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
                    this.countryDataList.push({ label: "Select", value: "Select" })
            
                    for (let data of this.countryReferenceData) {
                      this.countryDataList.push({ label: data.billingModelDesc, value: data.billingModelId })
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
    this.chargebackService.getProductData(event.value).subscribe(
      refData => {
        let arr: any = [];

        this.productReferenceData = refData;
        //this.productDataList.push({ label: "Select", value: "Select" })
        for (let data of this.productReferenceData) {
          this.productDataList.push({ label: data.productName, value: data.productId })
        }
      },
      error => {
      });
  }
  getServiceType(event){
    this.serviceTypeDataList=[];
    this.chargebackService.getServiceTypeData(event.value,this.chargeBackFilters.vendor).subscribe(
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
          this.chargeBackFilters.suggestedCostCenter=data.suggestedCostCenterDefault;
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
            this.getChargeBackData();
          },
          error => {
          });
     
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

}

