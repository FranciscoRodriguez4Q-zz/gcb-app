import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { VendorService } from './vendor.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SelectItem } from 'primeng/primeng';
import { Globals } from '../../shared/constants/globals';
import { HomeService } from '../home/home.service';
import { Subscription, Observable } from 'rxjs';
import { BackupModelService } from '../backupmodel.service';
import { Store, Select } from '@ngxs/store';
import { SharedState } from 'src/app/shared/state/shared.state';
import { VendorState } from 'src/app/layout/vendor/state/vendor.state';
import { VendorActions } from 'src/app/layout/vendor/state/vendor.actions';

@Component({
  selector: 'app-product',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit, OnDestroy {
  
  ngOnDestroy(): void {
    this.backupModelService.vendorTabModel ={
      vendorInsertData: this.vendorInsertData,
      formMode: this.formMode,
      editFlag: this.editFlag
    };
    if(this.subs != null && this.subs != undefined){
      this.subs.unsubscribe()
    }
  }

  public gridData: any = [];
  data:any;
  files: any ={};
  public vendorFormData: any = {
    "vendorEntityId": "",
    "vendorLegalEntityName": "",
    "active": "",
    "createdBy":"",
    "createdDate":"",
    "lastUpdatedDate": "",
    "updatedBy": "",
  };

  public vendorInsertData: any = {
    "hlVendorId":"",
    "vendorLegalEntityName":"",
    "active": true,
    // "createdBy":"503148032",
    // "updatedBy":"503148032"
  };
  public vendorInsertDataCopy: any;

  public vendorEntityId: any;
  public vendorLegalEntityName: any;
  public active: any;
  public lastUpdatedDate: any;
  public updatedBy: any;
  public createdBy: any;
  public createdDate: any;
  public errorMessage = "";
  public vendorHlName ="";
  public gridLoadFlag:boolean=false;
  vendorData:any = [];
  venDwnData:any = [];
  public downloadCols = [];
  public fileName : any ="Vendor";
  public saveMessage: any = [];
  public popupErrorMessage: any;
  public editFlag = false;
  @ViewChild('content1') errorMessagePopUp;
  closeResult: string;
  public vendor: any = [];
  public formMode="New";
  public hlvendorReferenceData: any;
  hlVendorDataList: SelectItem[] = [];
  public userFlag: boolean = true;

  private readonly KEY: string = 'Vendor';
  private subs: Subscription;

  @Select(SharedState.getUserDetails) userDetails$: Observable<any>
  @Select(VendorState.getFetching) gridLoadFlag$: Observable<any>
  @Select(VendorState.getVendors) vendors$: Observable<any>
  @Select(VendorState.getVendorNames) vendorNames$: Observable<any>
  
  constructor(
    private vendorService: VendorService,
    private modalService: NgbModal,
    private store: Store,
    private homeService: HomeService,
    private backupModelService: BackupModelService
    ) { }
  

  public cols = [
    { field: 'hlVendorName', header: 'HL Vendor', width: '10%' },
    { field: 'vendorLegalEntityName', header: 'Vendor Name', width: '10%' },
    { field: 'active', header: 'Active', width: '5%' },
    { field: 'updatedBy', header: 'Updated By', width: '10%' },
    { field: 'lastUpdatedDate', header: 'Updated Date', width: '10%' },
  ];

  async ngOnInit() {
    this.initStateOnComponent()
    for (let i = 0; i < this.cols.length; i++) {
      // console.log("in Download method"+i);
      this.downloadCols.push(this.cols[i].header);
    }
  }

  initStateOnComponent(){
    this.store.dispatch(new VendorActions.FetchVendors())
    this.store.dispatch(new VendorActions.FetchVendorNames())
    this.userDetails$.subscribe(({ roleNM }) => this.userFlag = roleNM !== 'ADMIN')
    this.gridLoadFlag$.subscribe(isFetching => this.gridLoadFlag = !isFetching)
    this.vendors$.subscribe(items=>{
      this.vendorData = items;
      this.venDwnData = items.map(item => {
        return {
          hlVendorName: item.hlVendorName,
          vendorLegalEntityName: item.vendorLegalEntityName,
          active: item.active,
          updatedBy: item.updatedBy,
          lastUpdatedDate: item.lastUpdatedDate
        }
      })
      this.initTreeSubscribe()
    })
    this.vendorNames$.subscribe(items=>{
      this.hlvendorReferenceData = items;
      this.hlVendorDataList = items.map(({hlVendorName, hlvendorId}) => ({ label: hlVendorName, value: hlvendorId }))
    })
  }

  initTreeSubscribe() {
    if (this.backupModelService.vendorTabModel != null 
      && this.backupModelService.vendorTabModel != undefined){
        this.vendorInsertData = this.backupModelService.vendorTabModel.vendorInsertData;
        this.formMode = this.backupModelService.vendorTabModel.formMode;
        this.editFlag = this.backupModelService.vendorTabModel.editFlag;
      }
    this.subs = this.homeService.state$.subscribe(({ [this.KEY]: item }) => {
      if (item) {
        const { id } = item;
        this.showSelectedData(id);
      }
    });
  }

  showSelectedData(vendorEntityId) {  
      console.log("radio button click" + vendorEntityId);
      this.editFlag = true;
      this.formMode="Modify";
      const modelTemp = this.vendorData.find(x => x.vendorEntityId == vendorEntityId);
      this.vendorInsertData = { ...modelTemp };
      this.vendorInsertDataCopy = { ...this.vendorInsertData }
      this.vendor = this.vendorInsertData;
  }

  public vendorFilter: any = {
    vendorName:"",
    active:true,
  }
  validation(){
    if(this.vendorInsertData.vendorLegalEntityName==""){
      this.errorMessage = "Please Enter Vendor Name";
      return false;
    }
    if(this.vendorInsertData.hlVendorId== null || this.vendorInsertData.hlVendorId=="" || this.vendorInsertData.hlVendorId=="Select" ){
      this.errorMessage = "Please Select Vendor HL Name";
      return false;
    }else{
      return true;
    }
  }

  cancel(){
    this.vendorInsertData={
      vendorLegalEntityName:"",
      active: true,
    }
    this.errorMessage ="";
    this.clearAllFilters()
  }

  async upsertVendor() {
    this.errorMessage = "";
    //this.msgs = [];
    console.log("test button click");
    if (this.validation()) {
      try{
        await this.store.dispatch(new VendorActions.UpsertVendor(this.vendorInsertData))
        this.cancel()
      }catch(e){}
    }
  }

  clearAllFilters() {
    this.errorMessage = "";
   /*  this.messageService.clear();
    this.msgs = []; */
    this.editFlag = false;
    this.formMode="New";
    this.vendorFormData = {
      vendorLegalEntityName: "Select",
      active: true,
      lastUpdatedDate: "",
      createdDate: "",
      createdBy: "",
      updatedBy: ""
    };
    this.popupErrorMessage = "";
  }

  get disabled() {
    if (this.editFlag) {
      return JSON.stringify(this.vendorInsertData) === JSON.stringify(this.vendorInsertDataCopy)
    }
    return false;
  }
}
