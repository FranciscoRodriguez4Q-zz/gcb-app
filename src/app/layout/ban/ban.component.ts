import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BanService } from './ban.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SelectItem } from 'primeng/primeng';
import {ListboxModule} from 'primeng/listbox';
import {PickListModule} from 'primeng/picklist';
import { environment } from 'src/environments/environment.prod';	
import { Globals } from '../../shared/constants/globals';
import { debug } from 'util';
import { HomeService } from '../home/home.service';
import { Subscription } from 'rxjs';
import { BackupModelService } from '../backupmodel.service';

@Component({
  selector: 'app-product',
  templateUrl: './ban.component.html',
  styleUrls: ['./ban.component.scss']
})
export class BanComponent implements OnInit, OnDestroy {
  isSystemsSelected = false;
  public gridData: any = [];
  data:any;
  files: any ={};

  lldCoeList : SelectItem[] =[
    { label: "Y", value: "Y" },
    { label: "N", value: "N" },
    { label: "L", value: "L" }  
  ];
  

public vendorServiceType : any ={
  "billedToLocationId":"",
	"billedFromLocationId":"",
	"billProcessId":""
};
  public cloneFlag = false;
  public errorFlag = false;
  public modeFlag = false;
  public billingModelType: any = [];

  public banInsertData: any = {
      banId:"",
      billProcessName: "",
      billProcessId:"",
      vendorBan: "",
      vendorCode: "",
      vendorConfigId:"",
      vendorFriendlyName: "",
      buyerId:"",
      buyerName: "",
      billingModel: "",
      mode: "TEST",
      invoiceBuyerLeName: "",
      active: "",
      activeTo: "",  
      goldIdOverrideFlag: "",
      overrideGoldId: "",
      liquidateBillRoutingId: "",
      directOffsetBuc: "",
      indirectOffsetBuc: "",
      isEquipment: "",
      sez:0,
      erpName: "",
      erpSystem: "",
      erpProject: "",
      erpTask: "",
      erpAwtGroupName: "",
      erpVatAwtGroupName: "",
      erpPaymentTerms: "",
      erpVendorGsl: "",
      erpVendorSiteCode: "",
      erpGuiDiff: "",
      erpCustRegNumber: "",
      vatUnspsc: "",
      buyerPaymentApprovalEmail: "",
      buyerContactSso: "",
      focusGroup: [],
      shipFromAddress: "",
      shipToCountry: 0,
      shipToProvince: "",
      shipToState: "",
      shipToCity: "",
      shipToZip4: "",
      shipTozip5: "",
      addCountryISOtoVendorName: "",
      useAssetFileVendorName: "",
      liquidateBillRoutingIdServiceType: "",
      lldCoeFlag: "",
      invoiceName: "UNSPECIFIED",
      vendorPaidBy: "UNSPECIFIED",
      liquidatedVia: "UNSPECIFIED",
      taxEngine: "UNSPECIFIED",
      cloneFlag : false,
      cloneOfId : "",
      detailedLocationId: ""
    };
  public banInsertDataCopy: any;

  billProcessReferenceList: SelectItem[] = [];
  public billProcessReference: any;
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
  public vBanFlag = false;
  @ViewChild('content1') errorMessagePopUp;
  @ViewChild('content2') modeMessagePopUp;
  closeResult: string;
  public formMode="New";
  public sourceSystem:any = [];
  public targetSystem:any = [];
  public countryCodeReferenceData: any;
  countryCodeReferenceDataList: SelectItem[] = [];
  public index = [];
  public indexST = [];
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
  public billingModelReferenceData: any;
  public billProcessReferenceData:any;
  otherServiceData:any = [];
  public costCenter:any;
  public unspsc:any;
  serviceTypeInsertData:any=[];
  public productBanId:any;
  public system:any=[];
  public invoiceNmReferenceData: any;
  invoiceNmReferenceDataList: SelectItem[] = [];
  invoiceNmCloneDataList: SelectItem[] = [];
  public paidByReferenceData: any;
  paidByReferenceDataList: SelectItem[] = [];
  paidByCloneDataList: SelectItem[] = [];
  public liquidateViaReferenceData: any;
  liquidateViaReferenceDataList: SelectItem[] = [];
  liquidateViaCloneDataList: SelectItem[] = [];
  public taxEngineReferenceData: any;
  taxEngineReferenceDataList: SelectItem[] = [];
  taxEngineCloneDataList: SelectItem[] = [];
  public regKey = "8c8606d1-e591-435f-a435-d112ba4cd43c";		
  public entityTypeID = "5";
  goldIdDisable : boolean =true;
  role: String = "";
  public userFlag: boolean = true;
  userInfo :any;
  private subs: Subscription;
  private readonly KEY: string = 'Ban';
  public countryId = null;

  constructor(
    private banService: BanService, 
    private modalService: NgbModal, 
    private globals: Globals,
    private homeService: HomeService,
    private backupModelService: BackupModelService
    ) {
    this.banService.getUserData().subscribe(
      refData => {
        this.userInfo = refData;
        console.log('user details captured:',this.userInfo);
        this.role = this.userInfo.User["roleName"];

        if (this.role==='ADMIN') {
          this.userFlag = false;
        }
        else {
          this.userFlag = true;
        }

      },
      error => {
      });    
   }
  

  public cols = [
    { field: 'vendorBan', header: 'Vendor Ban', width: '7%' },
    { field: 'vendorLegalEntityName', header: 'Vendor LE', width: '20%' },
    { field: 'locationFromCtry', header: 'Billed From', width: '12%' },
    { field: 'locationToCtry', header: 'Billed To', width: '12%' },
    { field: 'erpBuyerLeName', header: 'Buyer', width: '20%' },
    { field: 'invoiceName', header: 'Invoice Name', width: '20%' },
    { field: 'vendorPaidBy', header: 'Vendor Paid By', width: '20%' },
    { field: 'liquidatedVia', header: 'Liquidated Via', width: '20%' },
    { field: 'taxEngine', header: 'TaxEngine', width: '20%' },
	{ field: 'mode', header: 'Mode', width: '20%' }
  ];

 

  async ngOnInit() {
    await this.getAllBanDetails();
    for (let i = 0; i < this.cols.length; i++) {
      // console.log("in Download method"+i);
      this.downloadCols.push(this.cols[i].header);
    }    
    await this.getAllCountryData();
    await this.getAllFocusGroups();
    await this.getAllVendorConfig();
    await this.getAllProcessDet();
    await this.getAllBuyers();
    await this.getAllBillingModel();
    this.getAllModel();
    await this.getBillingModelTypes();
    this.subs = this.homeService.state$.subscribe(({ [this.KEY]: item }) => {
      if (item) {
        const { id } = item;
        this.showSelectedData(id);
      }
    });
    if(this.backupModelService.banTabModel != null 
      && this.backupModelService.banTabModel != undefined){
      this.banInsertData = this.backupModelService.banTabModel.banInsertData;
      this.targetSystem = this.backupModelService.banTabModel.targetSystem;
      this.sourceSystem = this.backupModelService.banTabModel.sourceSystem;
      this.serviceTypeReferenceData = this.backupModelService.banTabModel.serviceTypeReferenceData;
      this.serviceList = this.backupModelService.banTabModel.serviceList;
    }
  }

  ngOnDestroy() {
    this.backupModelService.banTabModel = {
      banInsertData: this.banInsertData,
      targetSystem: this.targetSystem,
      sourceSystem: this.sourceSystem,
      serviceTypeReferenceData: this.serviceTypeReferenceData,
      serviceList: this.serviceList
    };
    this.homeService.setState({ key: this.KEY, data: null })
    if(this.subs != null && this.subs != undefined){
      this.subs.unsubscribe()
    }
  }

  setBuyerDetails()
  {
    let buyerObj=this.buyerReferenceData.filter(x=>x.buyerId==this.banInsertData.buyerId)[0];
    this.banInsertData.currentGoldId=buyerObj.goldId;
  }

  enableGoldIdText()
  {
    if(this.goldIdDisable)
   this.goldIdDisable=false;
   else
   this.goldIdDisable=true;
  }

  getAllBanDetails() {
    return this.banService.getBanDetails().toPromise().then(
      refData => {
        this.banData = refData;
        this.gridLoadFlag = true;
        this.banData.map(item => {
          return {
            banId: this.banId,
            vendorCode: this.vendorCode,
            serviceTypeName: this.serviceTypeName,
            erpBuyerLeName: this.erpBuyerLeName,
            liquidateBillRoutingId: this.liquidateBillRoutingId,
            updatedBy: this.updatedBy,
            lastUpdated: this.lastUpdated,
          }
        }).forEach(item => this.banDwnData.push(item));
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     this.banData=refData;
    //     this.gridLoadFlag = true;

    //     this.banData.map(item => {
    //       return {
    //         banId:this.banId,
    //         vendorCode:this.vendorCode,
    //         serviceTypeName:this.serviceTypeName,
    //         erpBuyerLeName:this.erpBuyerLeName,
    //         liquidateBillRoutingId:this.liquidateBillRoutingId,
    //         updatedBy:this.updatedBy,
    //         lastUpdated:this.lastUpdated,
    //       }
    //   }).forEach(item => this.banDwnData.push(item));
    //   },
    //   error => {
    //   });
  }
  public detailInfo = null;
  showSelectedData(banId) {
    this.cloneFlag = false;
    this.expandAllPanels();
    window.scrollTo(0, 0);
    console.log("radio button click" + this.banId);
    this.editFlag = true;
    this.vBanFlag = true;
    this.formMode="Modify";
    this.clearServiceList();
    this.banService.getBanById(banId).subscribe(
      refData => {
        this.banInsertData = refData;
        this.setBuyerDetails();
        this.getSourceServiceType(banId);
        this.banInsertDataCopy = { ...this.banInsertData }
        this.detailInfo = {
          detailedLocationId: this.banInsertData.detailedLocationId,
          billedToLocationId: this.banInsertData.billedToLocationId
        }
      },
      error => {
      });

      this.banService.getTaregtServiceType(banId).subscribe(
        refData => {
          this.targetSystem=refData; 
          for(let sysData of this.targetSystem){
            this.banService.getTaregtServiceBanProductDetails(sysData,banId).subscribe(
              refData => {
                this.system=refData;
                this.serviceList.push(this.system);
                this.onSelectTargetFetch(this.system);
              }
            )
          }
        }
      )   
      this.tableValueChanged(this.banInsertData.erpAwtGroupName,this.banInsertData.erpVatAwtGroupName,this.banInsertData.erpPaymentTerms,this.banInsertData.directOffsetBuc,this.banInsertData.indirectOffsetBuc);
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async clearAllFilters(){
   this.banInsertData = {
      banId:"",
      billProcessName: "",
      billProcessId:"",
      vendorBan: "",
      vendorCode: "",
      vendorConfigId:"",
      vendorFriendlyName: "",
      buyerId:"",
      buyerName: "",
      billingModel: "",
      mode:  "TEST",
      invoiceBuyerLeName: "",
      active: "",
      activeTo: "",  
      goldIdOverrideFlag: "",
      overrideGoldId: "",
      liquidateBillRoutingId: "",
      directOffsetBuc: "",
      indirectOffsetBuc: "",
      isEquipment: "",
  
      erpName: "",
      erpSystem: "",
      erpProject: "",
      erpTask: "",
      erpAwtGroupName: "",
      erpVatAwtGroupName: "",
      erpPaymentTerms: "",
      erpVendorGsl: "",
      erpVendorSiteCode: "",
      erpGuiDiff: "",
      erpCustRegNumber: "",
      vatUnspsc: "",
      buyerPaymentApprovalEmail: "",
      buyerContactSso: "",
      focusGroup: "",
      shipFromAddress: "",
      shipToCountry: 0,
      shipToProvince: "",
      shipToState: "",
      shipToCity: "",
      shipToZip4: "",
      shipTozip5: "",
      addCountryISOtoVendorName: "",
      useAssetFileVendorName: "",
      liquidateBillRoutingIdServiceType: "",
      
      invoiceName: "UNSPECIFIED",
      vendorPaidBy: "UNSPECIFIED",
      liquidatedVia: "UNSPECIFIED",
      taxEngine: "UNSPECIFIED",
      cloneFlag : false,
      cloneOfId : ""
    };
    this.banInsertDataCopy = {};
    this.countryId = null;
    this.detailInfo = null;
    this.editFlag = false;
    this.formMode = "New";
    this.vBanFlag = false;
    this.cloneFlag = false;
    this.modeFlag = false;
    this.errorMessage = "";
   // this.popupErrorMessage = "";
    this.expandAllPanels();
    window.scrollTo(0, 0);
    await this.getBillingModelTypes();
  }

  validation() {
    if (this.banInsertData.billProcessId == 0) {
      this.errorMessage = "Please Select Bill Process";
      return false;
    }
    if (this.banInsertData.vendorBan == "") {
      this.errorMessage = "Please Enter Vendor Ban";
      return false;
    }
    if (this.banInsertData.vendorConfigId == 0) {
      this.errorMessage = "Please Enter Vendor Code";
      return false;
    }
    if (this.banInsertData.buyerId == 0) {
      this.errorMessage = "Please Select Buyer Name";
      return false;
    }
    if (this.banInsertData.mode == "") {
      this.errorMessage = "Please Select Mode";
      return false;
    }
    if (this.banInsertData.cloneFlag) {
      if (this.banInsertData.invoiceName == undefined || this.banInsertData.invoiceName == "undefined" || this.banInsertData.invoiceName == "") {
        this.errorMessage = "Please select Invoice Name for Clone record";
        return false;
      }
      if (this.banInsertData.vendorPaidBy == undefined || this.banInsertData.vendorPaidBy == "undefined" || this.banInsertData.vendorPaidBy == "") {
        this.errorMessage = "Please select Vendor Paid By for Clone record";
        return false;
      }
      if (this.banInsertData.liquidatedVia == undefined || this.banInsertData.liquidatedVia == "undefined" || this.banInsertData.liquidatedVia == "") {
        this.errorMessage = "Please select Liquidated Via for Clone record";
        return false;
      }
      if (this.banInsertData.taxEngine == undefined || this.banInsertData.taxEngine == "undefined" || this.banInsertData.taxEngine == "") {
        this.errorMessage = "Please select Tax Engine for Clone record";
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  }

  upsertBan() {
    this.errorMessage = "";
    if (this.validation()) {
      debugger;
      if (this.cloneFlag && this.vendorBan != this.banInsertData.vendorBan) {
        this.cloneFlag = false;
        this.modeFlag = false;
        this.banInsertData.cloneOfId = "";
        this.popupErrorMessage = "Vendor Ban has been modified, so creating a new record instead of a clone";
        this.open(this.modeMessagePopUp);
        return false;
      }
      /* if (this.banInsertData.cloneFlag){
        this.banInsertData.cloneOfId = this.banInsertData.banId;
        this.banInsertData.banId = 0;
      this.banInsertData.invoiceName = this.banInsertData.cloneInvoiceName;
        this.banInsertData.vendorPaidBy = this.banInsertData.cloneVendorPaidBy;
        this.banInsertData.liquidatedVia = this.banInsertData.cloneLiquidatedVia;
        this.banInsertData.taxEngine = this.banInsertData.cloneTaxEngine; 
      } */
      //this.cloneFlag = false;

      // this.banService.getBillRefIDTokensAssociated(this.banInsertData.liquidateBillRoutingId,
      //   this.regKey).subscribe(
      // refData => {
      //   let response = refData;
      //   let respArray = [];
      //   respArray.push(response);
      //   console.log(response);
      //   if (respArray[0].message === "No Tokens Associated") {
      //     this.errorMessage = respArray[0].message;
      //     this.popupErrorMessage = respArray[0].message;
      //     this.open(this.errorMessagePopUp);

      //   }
      //   else   if (respArray[0].message === "BillRef does not exist"){
      //     this.errorMessage = "Please Enter BUC/ADN details";
      //     this.popupErrorMessage = "Please Enter BUC/ADN details";
      //     this.banInsertData.liquidateBillRoutingId = "";
      //     this.open(this.errorMessagePopUp);

      //   }
      //   else {
      this.banService.upsertBan(this.banInsertData).subscribe(
        async refData => {
          this.errorFlag = true;
          this.saveMessage = refData;
          this.popupErrorMessage = this.saveMessage.statusMessage;
          this.open(this.errorMessagePopUp);
          console.log(this.saveMessage);
          if (!this.saveMessage.error && this.banInsertData.liquidateBillRoutingId && !this.editFlag) {
            this.associateBillRefToAsset(this.saveMessage.banId);
          }
          await this.getAllBanDetails();
          if (null != this.saveMessage.banId) {
            this.upsertBanProduct(this.saveMessage.banId);
          }
          if (!this.saveMessage.Error) {
            this.clearAllFilters();
            this.editFlag = false;
            this.cloneFlag = false;
            this.vBanFlag = false;
            this.errorFlag = false;
          }
        },
        error => {
        });
    }
    // },
    // error => {
    // });
    // }
    else {
      //this.open(this.errorMessage);
    }
  }

  associateBillRefToAsset(internalCbId) {

    this.banService.associateBillReftoAsset(
      this.banInsertData.liquidateBillRoutingId,
      internalCbId, // ban_id
      this.regKey
    ).subscribe(
      refData => {
        let response = refData;
        let respArray = [];
        respArray.push(response);
        if (respArray[0].Successful_Count === 1) { }
        else {
          if (!(respArray[0].RecordsArray[0].message === "Bill Ref Already Associated.")) {
            this.popupErrorMessage = respArray[0].RecordsArray[0].message;
            //this.open(this.errorMessagePopUp);
          }
        }
      },
      (error) => {
        this.errorFlag = true;
        this.popupErrorMessage = error;
        this.open(this.errorMessagePopUp);
      });

  }

  getAllCountryData() {
    return this.banService.getAllCountryCode().toPromise().then(
      refData => {
        let arr: any = [];
        this.countryCodeReferenceData = refData;
        this.countryCodeReferenceDataList.push({ label: "Select", value: "Select" })
        for (let data of this.countryCodeReferenceData) {
          let labelCountry = data.countryCode + " | " + data.countryName;
          this.countryCodeReferenceDataList.push({ label: labelCountry, value: data.countryId })
        }
      }
    ).catch(console.log);
    // .subscribe(
    //   refData => {
    //     let arr: any = [];
    //     this.countryCodeReferenceData = refData;
    //     this.countryCodeReferenceDataList.push({ label: "Select", value: "Select" })  
    //     for (let data of this.countryCodeReferenceData) {
    //       let labelCountry = data.countryCode + " | " + data.countryName;
    //       this.countryCodeReferenceDataList.push({ label: labelCountry, value: data.countryId })
    //     }
    //   },
    //   error => {
    //   });
  }

  getAllFocusGroups() {
    return this.banService.getAllFocusGroups().toPromise().then(
      refData => {
        let arr: any = [];
        this.focusReferenceData = refData;
        for (let data of this.focusReferenceData) {
          let labelFocus = data.focusGroupName;
          this.focusReferenceDataList.push({ label: labelFocus, value: data.focusGroupId })
        }
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     let arr: any = [];
    //     this.focusReferenceData = refData;
    //     for (let data of this.focusReferenceData) {
    //       let labelFocus = data.focusGroupName;
    //       this.focusReferenceDataList.push({ label: labelFocus, value: data.focusGroupId })
    //     }
    //   },
    //   error => {
    //   });
  }

  getVendorServiceType()
  {
    this.clearServiceList();
    if(this.banInsertData.vendorConfigId!=null || this.banInsertData.vendorConfigId!="Select")
    {
      console.log("selected vendorConfig:",this.banInsertData.vendorConfigId);
      let vendorConfigObj = this.vendorReferenceData.filter(x => x.vendorConfigId == this.banInsertData.vendorConfigId)[0];
      
      this.vendorServiceType.billedToLocationId=vendorConfigObj.billedToLocationId;
      this.vendorServiceType.billedFromLocationId=vendorConfigObj.billedFromLocationId;
      this.vendorServiceType.billProcessId=vendorConfigObj.billProcessId;

      this.banService.getVendorServiceType(this.vendorServiceType).subscribe(
          refData =>{
            this.serviceTypeReferenceData = refData; 
            this.sourceSystem=this.sourceSystem.concat(refData);
        for (let data of this.serviceTypeReferenceData) {
          let labelService = data.serviceTypeName;
          this.serviceTypeReferenceDataList.push({ label: labelService, value: data.serviceTypeId })
        }
          },
          error=>
          {

          }
);

    }
  }

  getAllVendorConfig() {
    return this.banService.getVendorConfigDetails().toPromise().then(
      refData => {
        let arr: any = [];
        this.vendorReferenceData = refData;
        for (let data of this.vendorReferenceData) {
          let labelService = data.vendorLegalEntityName + ' | ' + data.vendorCode + ' | ' + data.billedFromCountryCode + ' | ' + data.billedToCountryCode + ' | '
            + data.currencyCode;
          this.vendorReferenceDataList.push({ label: labelService, value: data.vendorConfigId })
        }
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     let arr: any = [];
    //     this.vendorReferenceData = refData;  
    //     for (let data of this.vendorReferenceData) {
    //       let labelService = data.vendorLegalEntityName+' | '+data.vendorCode+' | '+data.billedFromCountryCode+' | '+data.billedToCountryCode+' | '
    //       +data.currencyCode;
    //       this.vendorReferenceDataList.push({ label: labelService, value: data.vendorConfigId })
    //     }
    //   },
    //   error => {
    //   });      
  }

  getAllProcessDet() {
    return this.banService.getBillProcessList().toPromise().then(
      refData => {
        let arr: any = [];
        this.billProcessReference = refData;
        for (let data of this.billProcessReference) {
          this.billProcessReferenceList.push({ label: data.processName, value: data.billProcessId })
        }
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     let arr: any = [];
    //     this.billProcessReference = refData;
    //     for (let data of this.billProcessReference) {
    //       this.billProcessReferenceList.push({ label: data.processName, value: data.billProcessId })
    //     }
    //   },
    //   error => {
    //   });    
  }

  getAllBuyers() {
    return this.banService.getBuyerDetails().toPromise().then(
      refData => {
        let arr: any = [];
        this.buyerReferenceData = refData;
        for (let data of this.buyerReferenceData) {
          // let labelService = data.erpBuyerLeName;
          let labelService = data.erpBuyerLeName + " | " + data.erpOuEntityName + " | " + data.goldId;
          this.buyerReferenceDataList.push({ label: labelService, value: data.buyerId })
        }
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     let arr: any = [];
    //     this.buyerReferenceData = refData;  
    //     for (let data of this.buyerReferenceData) {
    //      // let labelService = data.erpBuyerLeName;
    //  let labelService = data.erpBuyerLeName +" | " +data.erpOuEntityName +" | "+data.goldId;

    //       this.buyerReferenceDataList.push({ label: labelService, value: data.buyerId })
    //     }
    //   },
    //   error => {
    //   });
  }

  getAllBillingModel() {
    //this.billingReferenceDataList.push({ label: "Select", value: "Select" });
    // this.billingReferenceDataList.push({ label: "Sabrix", value: "SABRIX" });
    // this.billingReferenceDataList.push({ label: "PayMaster", value: PAYMASTER" });
    // this.billingReferenceDataList.push({ label: "CoE Liquidation", value: "COE LIQUIDATION" });
    return this.banService.getBillingModelDetails().toPromise().then(
      refData => {
        let arr: any = [];
        this.billingModelReferenceData = refData;
        for (let data of this.billingModelReferenceData) {
          let labelService = data.billingModelDesc;
          this.billingReferenceDataList.push({ label: labelService, value: data.billingModelId })
        }
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     let arr: any = [];
    //     this.billingModelReferenceData = refData;  
    //     for (let data of this.billingModelReferenceData) {
    //       let labelService = data.billingModelDesc;
    //       this.billingReferenceDataList.push({ label: labelService, value: data.billingModelId })
    //     }
    //   },
    //   error => {
    //   });
  }

  getAllModel(){
    //this.modeReferenceDataList.push({ label: "Select", value: "Select" });
    this.modeReferenceDataList.push({ label: "PRODUCTION", value: "PRODUCTION" });
    this.modeReferenceDataList.push({ label: "TEST", value: "TEST" });
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
    this.indexST=[0,1];
    this.collapsed=false;
    this.panelExpansionFlag=false;
  }

  collapseAllPanels(){
    this.index = [];
    this.indexST=[];
    this.collapsed=true;
    this.panelExpansionFlag=true;
  }
  getClearData(){
    this.banInsertData={
      billedFromLocationId:"",
      billedToLocationId:"",
    }
  }

  setCountryId() {
    if (this.banInsertData.vendorConfigId != "Select" && this.banInsertData.vendorConfigId != "") {
      const [vendorConfigData] = this.vendorReferenceData.filter(x => x.vendorConfigId == this.banInsertData.vendorConfigId)
      this.countryId = vendorConfigData.billedToLocationId;
    }
  }

  getServiceType(){
    this.setCountryId();
    this.targetSystem=[];
    this.errorMessage = "";
    console.log('[INFO] - BanComponent - getServiceType()')
    if (
      this.banInsertData.vendorConfigId != "Select" && this.banInsertData.vendorConfigId != "" && 
      this.banInsertData.billProcessId != null && this.banInsertData.billProcessId != "") {
        let vendorConfigData=this.vendorReferenceData.filter(x => x.vendorConfigId == this.banInsertData.vendorConfigId)[0];
        this.banInsertData.billedFromLocationId=vendorConfigData.billedFromLocationId;
        this.banInsertData.billedToLocationId=vendorConfigData.billedToLocationId;
        //console.log("Vendor Selected : " + vendorConfigData);
        //console.log("process Id "+this.banInsertData.billProcessId);
        this.banService.getServiceType(this.banInsertData).subscribe(
          refData => {
            let arr: any = [];
            this.serviceTypeReferenceData = refData; 
            this.sourceSystem=refData; 
            for (let data of this.serviceTypeReferenceData) {
              let labelService = data.serviceTypeName;
              this.serviceTypeReferenceDataList.push({ label: labelService, value: data.serviceTypeId })
            }
          },
          error => {
          })
    }
    if(this.banInsertData.billProcessId== ""){
      this.errorMessage = "You must select a Bill process";
      return false;
    }
    // if(this.banInsertData.vendorConfigId != ""){
    //   this.errorMessage = "You must select a Vebndor Code";
    //   return false;
    // }
  }

  onSelectTarget(item:any){
    //this.getClearData();
    console.log("clicked"+item.items[0].serviceTypeId);
    if(null != item.items[0].serviceTypeId){}
    this.systems = this.serviceList.filter(x => x.serviceTypeId == item.items[0].serviceTypeId)[0];
    this.triggerEvent();
    this.isSystemsSelected =true;
  }
  triggerEvent(){
    console.log("trgger handle: "+this.systems);
    this.triggerUnspscEvent(this.systems.unspscOverrideFlag);
    this.triggerCostCenterEvent(this.systems.costCentreOverrideFlag);
    this.triggerErpPmtEvent(this.systems.erpPmtOverrideFlag);
    this.triggerErpAwtGrpEvent(this.systems.erpAwtGroupNameOverrideFlag);
    this.triggerErpVatAwtEvent(this.systems.erpVatAwtGroupOverrideFlag);
    this.triggerDirOffsetEvent(this.systems.directOffsetBucOverrideFlag);
    this.triggerindirectOffsetEvent(this.systems.indirectOffsetBucOverrideFlag);
  }
  isDisabledUnspsc = true;
  isDisableCostCenter = true;
  isDisableErpPmt = true;
  isDisableErpAwtGrp = true;
  isDisableErpVatAwt = true;
  isDisableDirOSAwt = true;
  isDisableIndirOSAwt = true;
  triggerUnspscEvent(unspscOverrideFlag) {
    if(unspscOverrideFlag)
      this.isDisabledUnspsc = false;
    else
    this.isDisabledUnspsc = true;
      return;
  }
  triggerCostCenterEvent(costCentreOverrideFlag){
    if(costCentreOverrideFlag)
      this.isDisableCostCenter = false;
    else
     this.isDisableCostCenter = true;
      return;
  }
  triggerErpPmtEvent(erpPmtOverrideFlag){
    if(erpPmtOverrideFlag)
    this.isDisableErpPmt = false;
    else
    this.isDisableErpPmt =true;
      return;
  } 
  triggerErpAwtGrpEvent(erpAwtGroupNameOverrideFlag){
    if(erpAwtGroupNameOverrideFlag)
    this.isDisableErpAwtGrp = false;
    else
    this.isDisableErpAwtGrp =true;
    return;
  }
  triggerErpVatAwtEvent(erpVatAwtGroupOverrideFlag){
    if(erpVatAwtGroupOverrideFlag)
    this.isDisableErpVatAwt = false;
    else
    this.isDisableErpVatAwt = true;
    return;
  }
  triggerDirOffsetEvent(directOffsetBucOverrideFlag){
    if(directOffsetBucOverrideFlag)
    this.isDisableDirOSAwt = false;
    else
    this.isDisableDirOSAwt = true;
    return;
  }
  triggerindirectOffsetEvent(indirectOffsetBucOverrideFlag){
    if(indirectOffsetBucOverrideFlag)
      this.isDisableIndirOSAwt = false;
    else
      this.isDisableIndirOSAwt =true;
    return;
  }

  tableValueChanged(erpAwtGroupName,erpVatAwtGroupName,erpPaymentTerms,directOffsetBuc,indirectOffsetBuc){
    this.banInsertData.overrideErpPmtTerms=erpPaymentTerms;
    this.banInsertData.overrideErpAwtGroupName=erpAwtGroupName;
    this.banInsertData.overrideDirectOffsetBuc =directOffsetBuc;
    this.banInsertData.overrideIndirectOffsetBuc =indirectOffsetBuc;
    this.banInsertData.overrideErpVatAwtGroupName=erpVatAwtGroupName
  }
  public services: any=[{
    "erpPaymentTerms":"",
    "erpAwtGroupName":"",
    "directOffsetBuc":"",
    "indirectOffsetBuc":"",
    "erpVatAwtGroupName":"",
  }]
  serviceList: Array<{
    serviceTypeId: string, 
    overrideErpPmtTerms: string,
    overrideErpAwtGroupName: string,
    overrideDirectOffsetBuc: string,
    overrideIndirectOffsetBuc:string,
    overrideErpVatAwtGroupName:string,
    overrideUnspsc:string,
    overrideOffsetCostCenter:string,
    unspscOverrideFlag:boolean,
    costCentreOverrideFlag:boolean,
    erpPmtOverrideFlag:boolean,
    erpAwtGroupNameOverrideFlag:boolean,
    erpVatAwtGroupOverrideFlag:boolean,
    directOffsetBucOverrideFlag:boolean,
    indirectOffsetBucOverrideFlag:boolean,
    unspsc:string,
    costCenter:string,
    erpPmtTerms:string,
    erpAwtGroupName:string,
    directOffsetBuc:string,
    indirectOffsetBuc:string,
    erpVatAwtGroupName:string
  }> = [];

  public systems :any ={
    serviceTypeId: "", 
    overrideErpPmtTerms: "",
    overrideErpAwtGroupName: "",
    overrideDirectOffsetBuc: "",
    overrideIndirectOffsetBuc:"",
    overrideErpVatAwtGroupName:"",
    overrideUnspsc:"",
    overrideOffsetCostCenter:"",
    unspscOverrideFlag:"",
    costCentreOverrideFlag:"",
    erpPmtOverrideFlag:"",
    erpAwtGroupNameOverrideFlag:"",
    erpVatAwtGroupOverrideFlag:"",
    directOffsetBucOverrideFlag:"",
    indirectOffsetBucOverrideFlag:"",
    unspsc:"",
    costCenter:"",
    erpPmtTerms:"",
    erpAwtGroupName:"",
    directOffsetBuc:"",
    indirectOffsetBuc:"",
    erpVatAwtGroupName:""
  }; 


  addTargetValueToArray(item:any){
    console.log(item);
    for (let system of item.items){
      if (system.serviceTypeId != null) {
        this.banInsertData.serviceTypeId = system.serviceTypeId;
        this.banService.getOtherServiceDet(this.banInsertData).subscribe(
          refData => {
            this.otherServiceData=refData;
            this.serviceList.push({ serviceTypeId: system.serviceTypeId, overrideErpPmtTerms: "",
              overrideErpAwtGroupName:"",overrideDirectOffsetBuc:"", 
              overrideIndirectOffsetBuc:"", overrideErpVatAwtGroupName:"",
              overrideUnspsc:"",overrideOffsetCostCenter:"",
              unspscOverrideFlag:false,costCentreOverrideFlag:false,
              erpPmtOverrideFlag:false,erpAwtGroupNameOverrideFlag:false,
              erpVatAwtGroupOverrideFlag:false,directOffsetBucOverrideFlag:false,
              indirectOffsetBucOverrideFlag:false,unspsc:this.otherServiceData.unspsc,costCenter:this.otherServiceData.costCenter,
              erpPmtTerms: this.banInsertData.overrideErpPmtTerms,erpAwtGroupName:this.banInsertData.overrideErpAwtGroupName,
              directOffsetBuc:this.banInsertData.overrideDirectOffsetBuc,indirectOffsetBuc:this.banInsertData.overrideIndirectOffsetBuc,
              erpVatAwtGroupName:this.banInsertData.overrideErpVatAwtGroupName})
        },
        error => {
        }); 
      }
    }
    console.log( this.serviceList);
  }

  removeTargetValueFromArray(item:any){
    console.log("remove"+item);
    this.systems = this.serviceList.filter(x => x.serviceTypeId == item.items[0].serviceTypeId)[0];
    var index= this.serviceList.indexOf(this.systems);
    this.serviceList.splice(index, 1);
    console.log("remove new list"+this.serviceList.length);
  }

  // upsertBanService() {
  //   this.errorMessage = "";
  //   //this.msgs = [];
  //   console.log("test button click");
  //   if (this.validation()) {
  //     this.banService.upsertBan(this.serviceList).subscribe(
  //       refData => {
  //         this.saveMessage = refData;
  //         if(!this.saveMessage.Error == undefined)
  //           this.popupErrorMessage = "Ban Already Exits";
  //         if(this.saveMessage.Error == false)
  //           this.popupErrorMessage = "Ban Name "+this.serviceList+" Save Suceesfully.";
  //         else
  //           this.popupErrorMessage =  "ban Name "+this.serviceList+" not Saved..";
  //         this.open(this.errorMessagePopUp);
  //         this.getAllBanDetails();
  //         this.clearAllFilters();
  //       },
  //       error => {
  //       });
  //   }else{
  //     //this.open(this.errorMessage);
  //   }
  // }

  generateBillRefId() {
 
    const requestorSSO =  "999999999"; //localStorage.getItem(AppConstants.LABEL_LOGGEDIN_SSO);
  
    this.banService.getBillHubRefID(this.regKey, requestorSSO, this.entityTypeID).subscribe(
      refData => {
        let response = refData;
        let respArray = [];
        respArray.push(response);
        if (respArray[0].OUTPUT === 'FAIL')
        {
          this.errorFlag = true;
          this.popupErrorMessage = respArray[0].BillRefID;
          this.open(this.errorMessagePopUp);
        }
       else if (respArray[0].BillRefID) {
          this.banInsertData.liquidateBillRoutingId = respArray[0].BillRefID;         
          this.editBillRef();
        } 
      },
      error => {
        this.errorFlag = true;
     this.popupErrorMessage ="Internal Server Error!";
     this.open(this.errorMessagePopUp);
      });
  }

  editBillRef(){

    let sso =999999999;
     window.open( environment.APP_BILLHUB_URL_UI_ENDPOINT + 
      "/EditBillReference;billRefId="+
     this.banInsertData.liquidateBillRoutingId+";sso="+sso+";mode=edit");
   
   }

   generateServiceBillRefId() {
 
    const requestorSSO =  "999999999"; //localStorage.getItem(AppConstants.LABEL_LOGGEDIN_SSO);
  
    this.banService.getBillHubRefID(this.regKey, requestorSSO, this.entityTypeID).subscribe(
      refData => {
        let response = refData;
        let respArray = [];
        respArray.push(response);
        if (respArray[0].OUTPUT === 'FAIL')
        {
          this.errorFlag = true;
          this.popupErrorMessage = respArray[0].BillRefID;
          this.open(this.errorMessagePopUp);
        }
       else if (respArray[0].BillRefID) {
          this.systems.liquidateBillRoutingId = respArray[0].BillRefID;         
          this.editServiceBillRef();
        } 
      },
      error => {
        this.errorFlag = true;
     this.popupErrorMessage ="Internal Server Error!";
     this.open(this.errorMessagePopUp);
      });
  }

   editServiceBillRef(){
    let sso =999999999;
     window.open( environment.APP_BILLHUB_URL_UI_ENDPOINT + 
      "/EditBillReference;billRefId="+
     this.systems.liquidateBillRoutingId+";sso="+sso+";mode=edit");
   
   }
  
   upsertBanProduct(productBanId) {
    console.log("Upsert Ban Product");
    if (this.validation()) {
      //this.productBanId=68;
      this.banService.upsertBanProduct(this.serviceList,productBanId).subscribe(
        refData => {
          //this.saveMessage = refData;
          // if(!this.saveMessage.Error == undefined)
          //   this.popupErrorMessage = "Ban Already Exits";
          // if(this.saveMessage.Error == false)
          //   this.popupErrorMessage = "Ban Name Save Suceesfully.";
          // else
          //   this.popupErrorMessage = "ban Name not Saved..";
          //   this.open(this.errorMessagePopUp);
          this.clearServiceList();
        },
        error => {
        });
    }else{
      //this.open(this.errorMessage);
    }
  }

  getSourceServiceType(banId:any){
    this.errorMessage = "";
    if (this.banInsertData.vendorConfigId != "Select" && this.banInsertData.vendorConfigId != null) {
      let vendorConfigData=this.vendorReferenceData.filter(x => x.vendorConfigId == this.banInsertData.vendorConfigId)[0];
      this.banInsertData.billedFromLocationId=vendorConfigData.billedFromLocationId;
      this.banInsertData.billedToLocationId=vendorConfigData.billedToLocationId;
      this.banService.getSourceServiceType(this.banInsertData,banId).subscribe(
        refData => {
          let arr: any = [];
          this.serviceTypeReferenceData = refData; 
          this.sourceSystem=refData; 
          for (let data of this.serviceTypeReferenceData) {
            let labelService = data.serviceTypeName;
            this.serviceTypeReferenceDataList.push({ label: labelService, value: data.serviceTypeId })
          }
        },
        error => {
        })
    }
  }


  onSelectTargetFetch(item:any){
    //console.log("clicked"+item.serviceTypeId);
    var testSystem = this.serviceList.filter(x => x.serviceTypeId == item.serviceTypeId)[0];
    //console.log(this.systems);
    this.banInsertData.serviceTypeId = testSystem.serviceTypeId;
      this.banService.getOtherServiceDet(this.banInsertData).subscribe(
        refData => {
          this.otherServiceData=refData;    
          testSystem.unspsc=this.otherServiceData.unspsc;
          testSystem.costCenter=this.otherServiceData.costCenter;     
        })
    //trigger events
    this.triggerUnspscEvent(testSystem.unspscOverrideFlag);
    this.triggerCostCenterEvent(testSystem.costCentreOverrideFlag);
    this.triggerErpPmtEvent(testSystem.erpPmtOverrideFlag);
    this.triggerErpAwtGrpEvent(testSystem.erpAwtGroupNameOverrideFlag);
    this.triggerErpVatAwtEvent(testSystem.erpVatAwtGroupOverrideFlag);
    this.triggerDirOffsetEvent(testSystem.directOffsetBucOverrideFlag);
    this.triggerindirectOffsetEvent(testSystem.indirectOffsetBucOverrideFlag);
    this.tableValueChanged(this.banInsertData.erpAwtGroupName,this.banInsertData.erpVatAwtGroupName,this.banInsertData.erpPaymentTerms,this.banInsertData.directOffsetBuc,this.banInsertData.indirectOffsetBuc)
  }
      
  cloneRecord() {
    this.cloneFlag = true;
    this.vBanFlag = false;
    this.banInsertData.cloneFlag = true;
    this.banInsertData.cloneOfId = this.banInsertData.banId;
    this.vendorBan = this.banInsertData.vendorBan;
  //  this.index = [0,1];
  //  this.collapsed=true;
  //  this.panelExpansionFlag = true;
  this.banInsertData.mode = "TEST";
  this.banInsertData.invoiceName = "UNSPECIFIED";
  this.banInsertData.vendorPaidBy = "UNSPECIFIED";
  this.banInsertData.liquidatedVia = "UNSPECIFIED";
    this.banInsertData.taxEngine = "UNSPECIFIED";
    this.banInsertData.banId = 0;
    this.banInsertData.liquidateBillRoutingId = "";
    // this.banService.getCloneBillingModelTypes(this.banInsertData.banId).subscribe(
    //   refData => {
    //     let arr: any = [];
    //     this.billingModelType = refData;
    //     for (let data in this.billingModelType.response) {
    //       if (data.toUpperCase()==="LIQUIDATED_VIA") {
    //         this.liquidateViaReferenceDataList = this.billingModelType.response[data];
    //       } else if (data.toUpperCase()==="PAID_BY") {
    //         this.paidByReferenceDataList = this.billingModelType.response[data];
    //       }else if (data.toUpperCase()==="INVOICE_NAME_VALUES") {
    //         this.invoiceNmReferenceDataList = this.billingModelType.response[data];
    //       } else {
    //         this.taxEngineReferenceDataList = this.billingModelType.response[data];
    //       }
    //     }
    //    

    //   },
    //   error => {
    //   });
  }

  getBillingModelTypes() {
    return this.banService.getBillingModelTypes().toPromise().then(
      refData => {
        let arr: any = [];
        this.billingModelType = refData;
        for (let data in this.billingModelType.response) {
          if (data.toUpperCase() === "LIQUIDATED_VIA") {
            this.liquidateViaReferenceDataList = this.billingModelType.response[data];
          } else if (data.toUpperCase() === "PAID_BY") {
            this.paidByReferenceDataList = this.billingModelType.response[data];
          } else if (data.toUpperCase() === "INVOICE_NAME_VALUES") {
            this.invoiceNmReferenceDataList = this.billingModelType.response[data];
          } else {
            this.taxEngineReferenceDataList = this.billingModelType.response[data];
          }
        }
      }
    ).catch(console.log);
    // .subscribe(
    //   refData => {
    //     let arr: any = [];
    //     this.billingModelType = refData;
    //     for (let data in this.billingModelType.response) {
    //       if (data.toUpperCase()==="LIQUIDATED_VIA") {
    //         this.liquidateViaReferenceDataList = this.billingModelType.response[data];
    //       } else if (data.toUpperCase()==="PAID_BY") {
    //         this.paidByReferenceDataList = this.billingModelType.response[data];
    //       }else if (data.toUpperCase()==="INVOICE_NAME_VALUES") {
    //         this.invoiceNmReferenceDataList = this.billingModelType.response[data];
    //       } else {
    //         this.taxEngineReferenceDataList = this.billingModelType.response[data];
    //       }
    //     }
    //   },
    //   error => {
    //   });    
  }

  cloneRec(flag) {
    this.popupErrorMessage = "";
    if (flag) {
      this.cloneFlag = true;
      this.modeFlag = false;
      this.errorFlag = false;
      this.popupErrorMessage = "Do you want to Clone the record?";
      this.open(this.errorMessagePopUp);
    }
    else {
      this.banInsertData.cloneFlag = false;
      this.cloneFlag = false;
    }
  }

  clearServiceList(){
    this.sourceSystem=[];
    this.targetSystem=[];
    this.triggerUnspscEvent(false);
    this.triggerCostCenterEvent(false);
    this.triggerErpPmtEvent(false);
    this.triggerErpAwtGrpEvent(false);
    this.triggerErpVatAwtEvent(false);
    this.triggerDirOffsetEvent(false);
    this.triggerindirectOffsetEvent(false);
    this.systems ={
      serviceTypeId: "", 
      overrideErpPmtTerms: "",
      overrideErpAwtGroupName: "",
      overrideDirectOffsetBuc: "",
      overrideIndirectOffsetBuc:"",
      overrideErpVatAwtGroupName:"",
      overrideUnspsc:"",
      overrideOffsetCostCenter:"",
      unspscOverrideFlag:"",
      costCentreOverrideFlag:"",
      erpPmtOverrideFlag:"",
      erpAwtGroupNameOverrideFlag:"",
      erpVatAwtGroupOverrideFlag:"",
      directOffsetBucOverrideFlag:"",
      indirectOffsetBucOverrideFlag:"",
    }; 
    this.serviceList=[];
  }

  onModeChange(mode : any) {
    if (mode.value === "PRODUCTION") { 
      this.banService.modeChange(this.banInsertData).subscribe(
        refData => {
          this.saveMessage = refData;
          this.modeFlag = true;
          if (this.saveMessage.status === "Success") {
            this.popupErrorMessage = this.saveMessage.message;
            this.open(this.modeMessagePopUp);
          }
        },
        error => {
        });
    }
  }

  changeMode(flag) {
    this.modeFlag = false;
    if (flag) {
      this.banInsertData.mode = "PRODUCTION";
    } else {
      this.banInsertData.mode = "TEST";
    }
  }

  onTabOpen(event) {
    console.log(event);
    this.indexST = [0,1];
    this.collapsed=false;
    this.panelExpansionFlag=false; 
}
onTabClose(event) {
    this.indexST = [];
    this.collapsed=true;
    this.panelExpansionFlag=true; 
}

getVendorCode() {
  if (this.banInsertData.billProcessId === 2) {
    this.banInsertData.vendorConfigId = ""
    this.countryId = null;
    this.vendorReferenceDataList = [];
    var vendorFilterData = this.vendorReferenceData.filter(x => String(x.vendorCode).startsWith('Z'));
    for (let data of vendorFilterData) {
      let labelService = data.vendorLegalEntityName + ' | ' + data.vendorCode + ' | ' + data.billedFromCountryCode + ' | ' + data.billedToCountryCode + ' | '
        + data.currencyCode;
      this.vendorReferenceDataList.push({ label: labelService, value: data.vendorConfigId })
    }
  }
  else {
    this.vendorReferenceDataList = [];
    for (let data of this.vendorReferenceData) {
      let labelService = data.vendorLegalEntityName + ' | ' + data.vendorCode + ' | ' + data.billedFromCountryCode + ' | ' + data.billedToCountryCode + ' | '
        + data.currencyCode;
      this.vendorReferenceDataList.push({ label: labelService, value: data.vendorConfigId })
    }
  }
} 

get disabled() {
if (this.editFlag) {
  return JSON.stringify(this.banInsertData) === JSON.stringify(this.banInsertDataCopy)
}
return false;
}

setLocationId(locationId) {
this.banInsertData.detailedLocationId = locationId;
}

}
