import { Component, OnInit, ViewChild, OnDestroy, DoCheck } from '@angular/core';
import { BanService } from './ban.service';
import { SelectItem } from 'primeng/primeng';
import { environment } from 'src/environments/environment.prod';	
import { HomeService } from '../home/home.service';
import { Subscription, Observable } from 'rxjs';
import { BackupModelService } from '../backupmodel.service';
import { Store, Select } from '@ngxs/store';
import { SharedState } from 'src/app/shared/state/shared.state';
import { BanState } from './state/ban.state';
import { BanActions } from './state/ban.actions';
import { SharedActions } from 'src/app/shared/state/shared.actions';
import swal from 'sweetalert2'
import * as _ from 'lodash'

@Component({
  selector: 'app-product',
  templateUrl: './ban.component.html',
  styleUrls: ['./ban.component.scss']
})
export class BanComponent implements OnInit, OnDestroy, DoCheck {
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
      payFromBillRoutingId: "",
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
  public gridLoadFlag: boolean = false;
  banData:any = [];
  banDwnData:any = [];
  public downloadCols = [];
  public fileName : any ="Ban";
  public saveMessage: any = [];
  public popupErrorMessage: any;
  public editFlag = false;
  public vBanFlag = false;
  public arrayErrorMessage;
  closeResult: string;
  public formMode="New";
  public sourceSystem:any = [];
  public targetSystem:any = [];
  public countryCodeReferenceData: any;
  countryCodeReferenceDataList: SelectItem[] = [];
  public index: number[] = [];
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
  isCharging: boolean = true;

  @Select(SharedState.getUserDetails) userDetails$: Observable<any>
  @Select(SharedState.getCountries) countryCodeReferenceData$: Observable<[]>
  @Select(SharedState.getBillProcesses) billProcessReference$: Observable<[]>
  @Select(BanState.getBansDetails) banData$: Observable<[]>
  @Select(BanState.getBansDetailsFetching) gridLoadFlag$: Observable<boolean>
  @Select(BanState.getFocusGroups) focusReferenceData$: Observable<[]>
  @Select(BanState.getVendorConfigDetails) vendorReferenceData$: Observable<[]>
  @Select(BanState.getBuyerDetails) buyerReferenceData$: Observable<[]>
  @Select(BanState.getBillingDetails) billingModelReferenceData$: Observable<[]>
  @Select(BanState.getBillingTypes) billingModelType$: Observable<[]>
  @Select(BanState.getAfterDataBan) afterBanData$: Observable<any>

  constructor(
    private banService: BanService, 
    private homeService: HomeService,
    private backupModelService: BackupModelService,
    private store: Store
    ) { }
  

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
    this.initStateOnComponent()
    this.downloadCols = this.cols.map(({ header }) => header)
    this.getAllModel();
    this.isCharging = false;
  }

  initStateOnComponent() {
    this.store.dispatch(new BanActions.FetchBans())
    this.store.dispatch(new BanActions.FetchFocusGroups())
    this.store.dispatch(new BanActions.FetchVendorConfigDetails())
    this.store.dispatch(new BanActions.FetchBuyerDetails())
    this.store.dispatch(new BanActions.FetchBillingDetails())
    this.store.dispatch(new BanActions.FetchBillingTypes())
    this.store.dispatch(new SharedActions.FetchCountry())
    this.store.dispatch(new SharedActions.FetchBillProcesses())
    this.userDetails$.subscribe(({ roleNM }) => this.userFlag = roleNM !== 'ADMIN')
    this.banData$.subscribe(items => this.getAllBanDetails(items))
    this.gridLoadFlag$.subscribe(band => this.gridLoadFlag = band)
    this.countryCodeReferenceData$.subscribe(items => this.getAllCountryData(items))
    this.focusReferenceData$.subscribe(items => this.getAllFocusGroups(items))
    this.vendorReferenceData$.subscribe(items => this.getAllVendorConfig(items))
    this.billProcessReference$.subscribe(items => this.getAllProcessDet(items))
    this.buyerReferenceData$.subscribe(items => this.getAllBuyers(items))
    this.billingModelReferenceData$.subscribe(items => this.getAllBillingModel(items))
    this.billingModelType$.subscribe(items => this.getBillingModelTypes(items))
    this.afterBanData$.subscribe(data => this.aferBanUpsert(data))
  }

  initTreeSubscribe() {
    if(this.backupModelService.banTabModel != null 
      && this.backupModelService.banTabModel != undefined){
      this.banInsertData = this.backupModelService.banTabModel.banInsertData;
      this.targetSystem = this.backupModelService.banTabModel.targetSystem;
      this.sourceSystem = this.backupModelService.banTabModel.sourceSystem;
      this.serviceTypeReferenceData = this.backupModelService.banTabModel.serviceTypeReferenceData;
      this.serviceList = this.backupModelService.banTabModel.serviceList;
      this.cloneFlag = this.backupModelService.banTabModel.cloneFlag;
      this.editFlag = this.backupModelService.banTabModel.editFlag;
      this.errorFlag = this.backupModelService.banTabModel.errorFlag;
      this.expansionEventFlag = this.backupModelService.banTabModel.expansionEventFlag;
      this.modeFlag = this.backupModelService.banTabModel.modeFlag;
      this.panelExpansionFlag = this.backupModelService.banTabModel.panelExpansionFlag;
      this.vBanFlag = this.backupModelService.banTabModel.vBanFlag;
      this.index =  this.backupModelService.banTabModel.index;
      this.indexST =  this.backupModelService.banTabModel.indexST;
      this.collapsed = this.backupModelService.banTabModel.collapsed;
    }
    this.subs = this.homeService.state$.subscribe(({ [this.KEY]: item }) => {
      if (item) {
        const { id } = item;
        this.showSelectedData(id);
      }
    });
  }

  ngOnDestroy() {
    this.backupModelService.banTabModel = {
      banInsertData: this.banInsertData,
      targetSystem: this.targetSystem,
      sourceSystem: this.sourceSystem,
      serviceTypeReferenceData: this.serviceTypeReferenceData,
      serviceList: this.serviceList,
      cloneFlag: this.cloneFlag,
      editFlag: this.editFlag,
      errorFlag: this.errorFlag,
      expansionEventFlag: this.expansionEventFlag,
      modeFlag: this.modeFlag,   
      panelExpansionFlag: this.panelExpansionFlag,
      vBanFlag: this.vBanFlag,
      index: this.index,
      indexST: this.indexST,
      collapsed: this.collapsed
    };
    this.homeService.setState({ key: this.KEY, data: null })
    if(this.subs != null && this.subs != undefined){
      this.subs.unsubscribe()
    }
  }

  ngDoCheck() {
    if (this.serviceList.length === 0) {
      this.systems = {}
    }
  }

  onTabOpen(e) {
    this.index.push(e.index);
  }

  onTabClose(e) {
    const idx = this.index.indexOf(e.index, 0);
    if (idx > -1) {
      this.index.splice(idx, 1);
    }
  }

  getAllBanDetails(items) {
    this.banData = items
    this.banDwnData = items.map(item => ({
      banId: item.banId,
      vendorCode: item.vendorCode,
      serviceTypeName: item.serviceTypeName,
      erpBuyerLeName: item.erpBuyerLeName,
      liquidateBillRoutingId: item.liquidateBillRoutingId,
      updatedBy: item.updatedBy,
      lastUpdated: item.lastUpdated,
    }))
    this.initTreeSubscribe()
  }

  getAllFocusGroups(items) {
    this.focusReferenceData = items;
    this.focusReferenceDataList = items.map(({ focusGroupName, focusGroupId }) => ({ label: focusGroupName, value: focusGroupId }))
  }

  getAllVendorConfig(items) {
    this.vendorReferenceData = items
    this.vendorReferenceDataList = items.map(item => {
      const { vendorLegalEntityName, vendorCode, billedFromCountryCode, billedToCountryCode, currencyCode, vendorConfigId } = item
      const label = `${vendorLegalEntityName} | ${vendorCode} | ${billedFromCountryCode} | ${billedToCountryCode} | ${currencyCode}`
      return {
        label,
        value: vendorConfigId
      }
    })  
  }

  getAllProcessDet(items) {
    this.billProcessReference = items
    this.billProcessReferenceList = items.map(({ processName, billProcessId }) => ({ label: processName, value: billProcessId }))    
  }

  getAllBuyers(items) {
    this.buyerReferenceData = items
    this.buyerReferenceDataList = items.map(item => {
      const { erpBuyerLeName, erpOuEntityName, goldId, buyerId } = item
      return {
        label: `${erpBuyerLeName} | ${erpOuEntityName} | ${goldId}`,
        value: buyerId
      }
    })
  }

  getAllCountryData(items) {
    this.countryCodeReferenceData = items
    this.countryCodeReferenceDataList = items.map(({ countryCode, countryName, countryId }) => ({
      label: `${countryCode} | ${countryName}`,
      value: countryId
    }))
  }

  getAllBillingModel(items) {
    this.billingModelReferenceData = items
    this.billingReferenceDataList = items.map(({ billingModelDesc, billingModelId }) => ({ label: billingModelDesc, value: billingModelId }))
  }

  getBillingModelTypes(items) {
    const { INVOICE_NAME_VALUES, LIQUIDATED_VIA, PAID_BY, TAX_ENGINE } = items
    this.liquidateViaReferenceDataList = LIQUIDATED_VIA
    this.paidByReferenceDataList = PAID_BY
    this.invoiceNmReferenceDataList = INVOICE_NAME_VALUES
    this.taxEngineReferenceDataList = TAX_ENGINE
  }

  setBuyerDetails() {
    let buyerObj = this.buyerReferenceData.filter(x => x.buyerId == this.banInsertData.buyerId)[0];
    this.banInsertData.currentGoldId = buyerObj.goldId;
  }

  enableGoldIdText() {
    if (this.goldIdDisable)
      this.goldIdDisable = false;
    else
      this.goldIdDisable = true;
  }

  public detailInfo = null;

  showSelectedData(banId) {
    console.log('[INFO] - showSelectedData - banId: ', banId)
    this.cloneFlag = false;
    this.expandAllPanels();
    window.scrollTo(0, 0);
    this.editFlag = true;
    this.vBanFlag = true;
    this.formMode = "Modify";
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
      error => { });

      this.banService.getTaregtServiceType(banId).subscribe(
        refData => {
        this.targetSystem = refData;
        for (let sysData of this.targetSystem) {
          this.banService.getTaregtServiceBanProductDetails(sysData, banId).subscribe(
            refData => {
              this.system = refData;
              this.serviceList.push(this.system);
              this.onSelectTargetFetch(this.system);
            }
          )
        }
      }
    )
    this.tableValueChanged(this.banInsertData.erpAwtGroupName, this.banInsertData.erpVatAwtGroupName, this.banInsertData.erpPaymentTerms, this.banInsertData.directOffsetBuc, this.banInsertData.indirectOffsetBuc);
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
      payFromBillRoutingId: "",
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
  }

  async validation() {
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
    const { liquidateBillRoutingId, payFromBillRoutingId } = this.banInsertData
    if (_.isEmpty(`${liquidateBillRoutingId}`) && _.isEmpty(`${payFromBillRoutingId}`)) {
      this.errorMessage = "Please provide Liquidation BUC/ADN and Pay from BUC/ADN"
      return false
    }
    const { valid, message } = await this.validateTokensBillHub()
    if (!valid) {
      const _message = message.filter(n => n)
      const htmlMessage = _message.reduce((result, item) => `${result}<p>${item}</p>`, '')
      await swal.fire({
        title: 'No Tokens Associated',
        html: htmlMessage,
        icon: 'warning',
        confirmButtonText: 'Ok'
      })
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
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  shouldAssociate: boolean = true
  async upsertBan() {
    this.errorMessage = "";
    if (await this.validation()) {
      if (this.cloneFlag && this.vendorBan != this.banInsertData.vendorBan) {
        await swal.fire({
          text: 'Vendor Ban has been modified, so creating a new record instead of a clone',
          icon: 'warning',
          confirmButtonText: 'Ok'
        })
        this.cloneFlag = false;
        this.banInsertData.cloneOfId = "";
      }
      try {
        await this.store.dispatch(new BanActions.UpsertBan(this.banInsertData)).toPromise()
        this.clearAllFilters()
        this.shouldAssociate = !this.editFlag
        this.editFlag = false
        this.cloneFlag = false
        this.vBanFlag = false
        this.errorFlag = false
      } catch(e) { }
    }
  }

  aferBanUpsert({ banId }) {
    if (banId) {
      if (this.shouldAssociate) {
        this.associateBan(banId)
      }
      this.upsertBanProduct(banId)
    }
  }

  upsertBanProduct(productBanId) {
    console.log('[INFO] - upsertBanProduct()')  
    if (this.validation()) {
      console.log('[INFO] - upsertBanProduct() - afterValidation')  
      this.banService.upsertBanProduct(this.serviceList, productBanId).subscribe(
        refData => {
          const { Error: error, banProducts, message  } = refData;
          if (!error) {
            this.associateProductBan(banProducts)
          } else {
            console.log('[INTERNAL-ERROR] - upsertBanProduct()')
            console.log('error', message)
          }
          this.clearServiceList();
        },
        error => {
          console.log('[SERVER-ERROR] - upsertBanProduct()')
          console.log('error', error)
        });
    }
  }

  validateTokensBillHub() {
    const { regKey } = this.EXTERNAL_SYSTEM_CONFIG;
    const { liquidateBillRoutingId, payFromBillRoutingId } = this.banInsertData;
    const banBillRefs = [liquidateBillRoutingId, payFromBillRoutingId]
    const billRefs = this.serviceList.reduce((result, item) => {
      const { liquidateBillRoutingId, payFromBillRoutingId } = item
      return [...result, liquidateBillRoutingId, payFromBillRoutingId]
    }, banBillRefs)
    const request = billRefs.filter(n => n).map(billRef => {
        return this.banService.validateBillRefTokens(billRef, regKey).toPromise().then(response => {
          return {
            ...response,
            billRef
          }
        }).catch(e => e)
    })
    return Promise.all(request).then(response => {
      console.log('response', response)
      const valid = !response.some(({ message }) => message === 'No Tokens Associated')
      const message = response.map(item => {
        if (item) {
          const { billRef, message } = item
          return `Billref: ${billRef} --> ${message === '' ? 'Success' : `${message}`}`
        }
      })
      return valid ? { valid } : { valid, message }
    })
  }

  associateBan(banId) {
    const { regKey, billingEntities } = this.EXTERNAL_SYSTEM_CONFIG;
    const banLevelEntities = billingEntities.filter(({ billingEntityName }) => !billingEntityName.includes('ST'))
    const request = banLevelEntities.map(item => {
      const { key } = item
      const billRefId = this.banInsertData[key]
      return this.banService.associateBillReftoAsset(billRefId, banId, regKey).toPromise().catch(e => e)
    })
    Promise.all(request).then(result => {
      console.log('[INFO] - BanComponent - associateBan()')
      console.log('result', result)
    })
  }

  associateProductBan(banProducts) {
    const { regKey } = this.EXTERNAL_SYSTEM_CONFIG;
    const requests = banProducts.reduce((result, item) => {
      const { liquidateBillRoutingId, payFromBillRoutingId, banProductId } = item
      const items = []
      if (liquidateBillRoutingId !== 0) {
        items.push(this.banService.associateBillReftoAsset(liquidateBillRoutingId, banProductId, regKey).toPromise().catch(e => e))
      }
      if (payFromBillRoutingId !== 0) {
        items.push(this.banService.associateBillReftoAsset(payFromBillRoutingId, banProductId, regKey).toPromise().catch(e => e))
      }
      return [...result, ...items]
    }, [])
    Promise.all(requests).then(result => {
      console.log('[INFO] - BanComponent - associateProductBan()')
      console.log('result', result)
    })
  }

  getVendorServiceType() {
    this.clearServiceList();
    if (this.banInsertData.vendorConfigId != null || this.banInsertData.vendorConfigId != "Select") {
      console.log("selected vendorConfig:", this.banInsertData.vendorConfigId);
      let vendorConfigObj = this.vendorReferenceData.filter(x => x.vendorConfigId == this.banInsertData.vendorConfigId)[0];

      this.vendorServiceType.billedToLocationId = vendorConfigObj.billedToLocationId;
      this.vendorServiceType.billedFromLocationId = vendorConfigObj.billedFromLocationId;
      this.vendorServiceType.billProcessId = vendorConfigObj.billProcessId;

      this.banService.getVendorServiceType(this.vendorServiceType).subscribe(
        refData => {
          this.serviceTypeReferenceData = refData;
          this.sourceSystem = this.sourceSystem.concat(refData);
          for (let data of this.serviceTypeReferenceData) {
            let labelService = data.serviceTypeName;
            this.serviceTypeReferenceDataList.push({ label: labelService, value: data.serviceTypeId })
          }
        },
        error => {});
    }
  }

  getAllModel(){
    //this.modeReferenceDataList.push({ label: "Select", value: "Select" });
    this.modeReferenceDataList.push({ label: "PRODUCTION", value: "PRODUCTION" });
    this.modeReferenceDataList.push({ label: "TEST", value: "TEST" });
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

  onSelectTarget(item: any) {
    //this.getClearData();
    console.log("clicked" + item.items[0].serviceTypeId);
    if (null != item.items[0].serviceTypeId) { }
    this.systems = this.serviceList.filter(x => x.serviceTypeId == item.items[0].serviceTypeId)[0];
    this.triggerEvent();
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
    erpVatAwtGroupName:string,
    liquidateBillRoutingId ? : number,
    payFromBillRoutingId ? : number
  }> = [];

  public systems :any = {};
  // public systems :any ={
  //   serviceTypeId: "", 
  //   overrideErpPmtTerms: "",
  //   overrideErpAwtGroupName: "",
  //   overrideDirectOffsetBuc: "",
  //   overrideIndirectOffsetBuc:"",
  //   overrideErpVatAwtGroupName:"",
  //   overrideUnspsc:"",
  //   overrideOffsetCostCenter:"",
  //   unspscOverrideFlag:"",
  //   costCentreOverrideFlag:"",
  //   erpPmtOverrideFlag:"",
  //   erpAwtGroupNameOverrideFlag:"",
  //   erpVatAwtGroupOverrideFlag:"",
  //   directOffsetBucOverrideFlag:"",
  //   indirectOffsetBucOverrideFlag:"",
  //   unspsc:"",
  //   costCenter:"",
  //   erpPmtTerms:"",
  //   erpAwtGroupName:"",
  //   directOffsetBuc:"",
  //   indirectOffsetBuc:"",
  //   erpVatAwtGroupName:""
  // }; 


  addTargetValueToArray(item: any) {
    console.log(item);
    for (let system of item.items) {
      if (system.serviceTypeId != null) {
        this.banInsertData.serviceTypeId = system.serviceTypeId;
        this.banService.getOtherServiceDet(this.banInsertData).subscribe(
          refData => {
            this.otherServiceData = refData;
            this.serviceList.push({
              serviceTypeId: system.serviceTypeId,
              overrideErpPmtTerms: "",
              overrideErpAwtGroupName: "",
              overrideDirectOffsetBuc: "",
              overrideIndirectOffsetBuc: "",
              overrideErpVatAwtGroupName: "",
              overrideUnspsc: "",
              overrideOffsetCostCenter: "",
              unspscOverrideFlag: false,
              costCentreOverrideFlag: false,
              erpPmtOverrideFlag: false,
              erpAwtGroupNameOverrideFlag: false,
              erpVatAwtGroupOverrideFlag: false,
              directOffsetBucOverrideFlag: false,
              indirectOffsetBucOverrideFlag: false,
              unspsc: this.otherServiceData.unspsc,
              costCenter: this.otherServiceData.costCenter,
              erpPmtTerms: this.banInsertData.overrideErpPmtTerms,
              erpAwtGroupName: this.banInsertData.overrideErpAwtGroupName,
              directOffsetBuc: this.banInsertData.overrideDirectOffsetBuc,
              indirectOffsetBuc: this.banInsertData.overrideIndirectOffsetBuc,
              erpVatAwtGroupName: this.banInsertData.overrideErpVatAwtGroupName
            })
          },
          error => {
          });
      }
    }
    console.log(this.serviceList);
  }

  removeTargetValueFromArray(item:any){
    console.log("remove"+item);
    this.systems = this.serviceList.filter(x => x.serviceTypeId == item.items[0].serviceTypeId)[0];
    var index= this.serviceList.indexOf(this.systems);
    this.serviceList.splice(index, 1);
    console.log("remove new list"+this.serviceList.length);
  }

  private readonly EXTERNAL_SYSTEM_CONFIG = {
    regKey: '63082218-d4d2-4987-8e06-5fb975beca6a',
    billingEntities: [
      {
        billingEntityId: '24',
        billingEntityName: 'BAN_ST_LIQ',
        key: 'liquidateBillRoutingId'
      },
      {
        billingEntityId: '25',
        billingEntityName: 'BAN_LIQ',
        key: 'liquidateBillRoutingId'
      },
      {
        billingEntityId: '26',
        billingEntityName: 'BAN_ST_PAY_FROM',
        key: 'payFromBillRoutingId'
      },
      {
        billingEntityId: '27',
        billingEntityName: 'BAN_PAY_FROM',
        key: 'payFromBillRoutingId'
      }
    ]
  }

  async generateBillRefId(type) {
    try {
      const { regKey, billingEntities } = this.EXTERNAL_SYSTEM_CONFIG;
      const { billingEntityId, key } = billingEntities.find(({ billingEntityName }) => billingEntityName === type)
      const requestorSSO = '999999999' //localStorage.getItem(AppConstants.LABEL_LOGGEDIN_SSO)
      const { OUTPUT: output, BillRefID: billRefId } = await this.banService.getBillHubRefID(regKey, requestorSSO, billingEntityId).toPromise()
      if (output === 'FAIL') {
        throw { error: billRefId }
      } else if (billRefId) {
        if (type.includes('ST')) {
          this.systems[key] = billRefId
        } else {
          this.banInsertData[key] = billRefId
        }
        this.editBillRef(type)
      }
    } catch (e) {
      const message = e.hasOwnProperty('error') ? e.error : 'Internal Server Error!'
      swal.fire({
        text: message,
        icon: 'error'
      })
    }
  }

  editBillRef(type) {
    const requestorSSO = '999999999' //localStorage.getItem(AppConstants.LABEL_LOGGEDIN_SSO);
    const { billingEntities } = this.EXTERNAL_SYSTEM_CONFIG;
    const { key } = billingEntities.find(({ billingEntityName }) => billingEntityName === type)
    const billRefId = type.includes('ST') ? this.systems[key] : this.banInsertData[key]
    window.open(`${environment.APP_BILLHUB_URL_UI_ENDPOINT}/EditBillReference;billRefId=${billRefId};sso=${requestorSSO};mode=edit`)
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

  async cloneRec() {
    console.log('[INFO] - cloneRec()')
    const { value } = await swal.fire({
      text: 'Do you want to Clone the record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    })
    if(value) {
      this.cloneRecord()
    } else {
      this.banInsertData.cloneFlag = false;
      this.cloneFlag = false;
    }
  }
      
  cloneRecord() {
    console.log('[INFO] - cloneRecord()')
    this.cloneFlag = true;
    this.vBanFlag = false;
    this.banInsertData.cloneFlag = true;
    this.banInsertData.cloneOfId = this.banInsertData.banId;
    this.vendorBan = this.banInsertData.vendorBan;
    this.banInsertData.mode = "TEST";
    this.banInsertData.invoiceName = "UNSPECIFIED";
    this.banInsertData.vendorPaidBy = "UNSPECIFIED";
    this.banInsertData.liquidatedVia = "UNSPECIFIED";
    this.banInsertData.taxEngine = "UNSPECIFIED";
    this.banInsertData.banId = 0;
    this.banInsertData.liquidateBillRoutingId = '';
    this.banInsertData.payFromBillRoutingId = ''
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
    // this.systems ={ 
    //   serviceTypeId: "", 
    //   overrideErpPmtTerms: "",
    //   overrideErpAwtGroupName: "",
    //   overrideDirectOffsetBuc: "",
    //   overrideIndirectOffsetBuc:"",
    //   overrideErpVatAwtGroupName:"",
    //   overrideUnspsc:"",
    //   overrideOffsetCostCenter:"",
    //   unspscOverrideFlag:"",
    //   costCentreOverrideFlag:"",
    //   erpPmtOverrideFlag:"",
    //   erpAwtGroupNameOverrideFlag:"",
    //   erpVatAwtGroupOverrideFlag:"",
    //   directOffsetBucOverrideFlag:"",
    //   indirectOffsetBucOverrideFlag:"",
    // }; 
    this.systems = {}
    this.serviceList=[];
  }

  onModeChange(mode: any) {
    if (mode.value === 'PRODUCTION') {
      this.banService.modeChange(this.banInsertData).toPromise().then(async response => {
        const { status, message } = response
        if (status === 'Success') {
          const { value } = await swal.fire({
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          })
          this.banInsertData.mode = value ? 'PRODUCTION' : 'TEST'
        }
      }).catch(console.log)
    }
  }

  onTabOpenST(event) {
    console.log(event);
    this.indexST = [0, 1];
    this.collapsed = false;
    this.panelExpansionFlag = false;
  }

  onTabCloseST(event) {
    this.indexST = [];
    this.collapsed = true;
    this.panelExpansionFlag = true;
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

  get isSystemsSelected() {
    return Object.keys(this.systems).length > 0
  }

  get shouldDisableLiq() {
    if (this.banInsertData.billProcessId === 1) { // Items
      return !this.isSystemsSelected || true
    } else if (this.banInsertData.billProcessId === 2) { // Gotems
      return !this.isSystemsSelected || true
    }
    return !this.isSystemsSelected || false
  }

  get shouldDisablePayFrom() {
    if (this.banInsertData.billProcessId === 1) { // Items
      return !this.isSystemsSelected || true
    } else if (this.banInsertData.billProcessId === 2) { // GOTEMS
      return !this.isSystemsSelected || false
    }
    return !this.isSystemsSelected || false;
  }

}
