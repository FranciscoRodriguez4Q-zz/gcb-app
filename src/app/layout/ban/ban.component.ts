import { Component, OnInit, ViewChild } from '@angular/core';
import { BanService } from './ban.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SelectItem } from 'primeng/primeng';
import {ListboxModule} from 'primeng/listbox';
import {PickListModule} from 'primeng/picklist';

@Component({
  selector: 'app-product',
  templateUrl: './ban.component.html',
  styleUrls: ['./ban.component.scss']
})
export class BanComponent implements OnInit {

  public gridData: any = [];
  data:any;
  files: any ={};
  public banFormData: any = {
    "banId": "",
    "vendorBan": "",
    "vendorConfigId": "",
    "vendorCode":"",
    "serviceTypeId":"",
    "serviceTypeName": "",
    "buyerId":"",
    "erpBuyerLeName":"",
    "liquidateBillRoutingId":"",
    "updatedBy": "",
    "lastUpdatedDate":"lastUpdatedDate",
  };


  public banId: any;
  public vendorBan: any;
  public vendorConfigId: any;
  public vendorCode: any;
  public serviceTypeId: any;
  public serviceTypeName: any;
  public buyerId:any;
  public erpBuyerLeName:any;
  public liquidateBillRoutingId:any;
  public updatedBy: any;
  public lastUpdated: any;
  public errorMessage = "";
  public gridLoadFlag:boolean=false;
  banData:any = [];
  banDwnData:any = [];
  public downloadCols = [];
  public fileName : any ="Ban";
  public saveMessage: any = [];
  public popupErrorMessage: any;
  public editFlag = false;
  @ViewChild('content1') errorMessagePopUp;
  closeResult: string;
  public formMode="New";
  public sourceSystem:any = [];
  public targetSystem:any = [];
  public countryCodeReferenceData: any;
  countryCodeReferenceDataList: SelectItem[] = [];
  public index = [];
  public expansionEventFlag = true;
  public collapsed=true;
  public panelExpansionFlag=true;
  public focusReferenceData: any;
  focusReferenceDataList: SelectItem[] = [];
  public serviceTypeReferenceData: any;
  serviceTypeReferenceDataList: SelectItem[] = [];
  public vendorReferenceData: any;
  vendorReferenceDataList: SelectItem[] = [];
  productReferenceDataList: SelectItem[] = [];
  public buyerReferenceData: any;
  buyerReferenceDataList: SelectItem[] = [];
  billingReferenceDataList: SelectItem[] = [];
  modeReferenceDataList: SelectItem[] = [];
  
  constructor(private banService: BanService,private modalService: NgbModal) { }
  

  public cols = [
    { field: 'vendorBan', header: 'Ban ID', width: '20%' },
    { field: 'vendorCode', header: 'Vendor Name', width: '5%' },
    { field: 'serviceTypeName', header: 'Service Type Name', width: '10%' },
    { field: 'erpBuyerLeName', header: 'Buyer Name', width: '20%' },
    { field: 'liquidateBillRoutingId', header: 'Bill Rote ID', width: '10%' },
    { field: 'updatedBy', header: 'Updated By', width: '10%' },
    { field: 'lastUpdated', header: 'Updated Date', width: '10%' },
  ];

  public banInsertData: any = {
    
  };

  ngOnInit() {
    this.getAllBanDetails();
    for (let i = 0; i < this.cols.length; i++) {
      // console.log("in Download method"+i);
      this.downloadCols.push(this.cols[i].header);
    }    
    this.getAllCountryData();
    this.getAllFocusGroups();
    this.getAllServiceType();
    this.getAllVendorConfig();
    this.getAllProcessDet();
    this.getAllBuyers();
    this.getAllBillingModel();
    this.getAllModel();
  }

  getAllBanDetails() {
    this.banService.getBanDetails().subscribe(
      refData => {
        this.banData=refData;
        this.gridLoadFlag = true;

        this.banData.map(item => {
          return {
            banId:this.banId,
            vendorCode:this.vendorCode,
            serviceTypeName:this.serviceTypeName,
            erpBuyerLeName:this.erpBuyerLeName,
            liquidateBillRoutingId:this.liquidateBillRoutingId,
            updatedBy:this.updatedBy,
            lastUpdated:this.lastUpdated,
          }
      }).forEach(item => this.banDwnData.push(item));
      },
      error => {
      });
  }

  showSelectedData(banId) {
    console.log("radio button click" + this.banId);
    this.editFlag = true;
    this.formMode="Modify";
    this.banInsertData = this.banData.filter(x => x.banId == banId)[0];
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  clearAllFilters(){
    this.banInsertData={
      
    }
    this.errorMessage ="";
  }

  validation(){
    if(this.banInsertData.processName==""){
      this.errorMessage = "Please Enter Process Name";
      return false;
    }
    if(this.banInsertData.vendorBan==""){
      this.errorMessage = "Please Enter Vendor Ban";
      return false;
    }
    if(this.banInsertData.vendorCode==""){
      this.errorMessage = "Please Select vendor Code";
      return false;
    }
    if(this.banInsertData.buyerId==""){
      this.errorMessage = "Please Select Buyer Name";
      return false;
    }
    if(this.banInsertData.billingModelR==""){
      this.errorMessage = "Please Select Billing Model";
      return false;
    }
    if(this.banInsertData.invoiceBuyerLeName==""){
      this.errorMessage = "Please Enter Invoice Buyer Le Name";
      return false;
    }

    else{
      return true;
    }
  }

  upsertBan() {
    this.errorMessage = "";
    //this.msgs = [];
    console.log("test button click");
    if (this.validation()) {
      this.banInsertData.createdBy="503148032";
      this.banInsertData.updatedBy="503148032";
      this.banService.upsertBan(this.banInsertData).subscribe(
        refData => {
          this.saveMessage = refData;
          if(!this.saveMessage.Error == undefined)
            this.errorMessagePopUp = "Ban Already Exits";
          if(this.saveMessage.Error == false)
            this.errorMessagePopUp = "Ban Name "+this.banInsertData.erpBanLeName+" Save Suceesfully.";
          else
            this.errorMessagePopUp =  "ban Name "+this.banInsertData.erpBanLeName+" not Saved..";
          this.open(this.errorMessagePopUp);
          this.getAllBanDetails();
          this.clearAllFilters();
        },
        error => {
        });
    }else{
      //this.open(this.errorMessage);
    }
  }

  getAllCountryData(){
    this.banService.getAllCountryCode().subscribe(
      refData => {
        let arr: any = [];
        this.countryCodeReferenceData = refData;
        //this.countryCodeReferenceDataList.push({ label: "Select", value: "Select" })
  
        for (let data of this.countryCodeReferenceData) {
          let labelCountry = data.countryCode + " | " + data.countryName;
          this.countryCodeReferenceDataList.push({ label: labelCountry, value: data.countryId })
        }
      },
      error => {
      });
  }

  getAllFocusGroups(){
    this.banService.getAllFocusGroups().subscribe(
      refData => {
        let arr: any = [];
        this.focusReferenceData = refData;
        for (let data of this.focusReferenceData) {
          let labelFocus = data.focusGroupName;
          this.focusReferenceDataList.push({ label: labelFocus, value: data.focusGroupId })
        }
      },
      error => {
      });
  }

  getAllServiceType() {
    this.banService.getServicetypeData().subscribe(
      refData => {
        let arr: any = [];
        this.serviceTypeReferenceData = refData; 
        this.sourceSystem=this.sourceSystem.concat(refData); 
        for (let data of this.serviceTypeReferenceData) {
          let labelService = data.serviceTypeName;
          this.serviceTypeReferenceDataList.push({ label: labelService, value: data.serviceTypeId })
        }
      },
      error => {
      });      
  }

  getAllVendorConfig() {
    this.banService.getVendorConfigDetails().subscribe(
      refData => {
        let arr: any = [];
        this.vendorReferenceData = refData;  
        for (let data of this.vendorReferenceData) {
          let labelService = data.vendorCode+' | '+data.billedFromCountryCd+' | '+data.billedToCountryCd+' | '+data.currencyCode;
          this.vendorReferenceDataList.push({ label: labelService, value: data.vendorConfigId })
        }
      },
      error => {
      });      
  }

  getAllProcessDet(){
    //this.productReferenceDataList.push({ label: "Select", value: "Select" });
    this.productReferenceDataList.push({ label: "TELECOM", value: "TELECOM" });
    this.productReferenceDataList.push({ label: "GOTEMS", value: "GOTEMS" });
  }

  getAllBuyers(){
    this.banService.getBuyerDetails().subscribe(
      refData => {
        let arr: any = [];
        this.buyerReferenceData = refData;  
        for (let data of this.buyerReferenceData) {
          let labelService = data.erpBuyerLeName;
          this.buyerReferenceDataList.push({ label: labelService, value: data.buyerId })
        }
      },
      error => {
      });
  }

  getAllBillingModel(){
    //this.billingReferenceDataList.push({ label: "Select", value: "Select" });
    this.billingReferenceDataList.push({ label: "Sabrix", value: "Sabrix" });
    this.billingReferenceDataList.push({ label: "PayMaster", value: "PayMaster" });
    this.billingReferenceDataList.push({ label: "CoE Liquidation", value: "CoE Liquidation" });
  }

  getAllModel(){
    //this.modeReferenceDataList.push({ label: "Select", value: "Select" });
    this.modeReferenceDataList.push({ label: "Production", value: "Production" });
    this.modeReferenceDataList.push({ label: "Test", value: "Test" });
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

  expandAllPanels(){
    this.index = [0,1,2,3,4,5,6,7];
    this.collapsed=false;
    this.panelExpansionFlag=false;
  }

  collapseAllPanels(){
    this.index = [];
    this.collapsed=true;
    this.panelExpansionFlag=true;
  }
}
