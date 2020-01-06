import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BuyerService } from './buyer.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SelectItem } from 'primeng/primeng';
import { Globals } from '../../shared/constants/globals';
import { Subscription, Observable } from 'rxjs';
import { HomeService } from '../home/home.service';
import { BackupModelService } from '../backupmodel.service';
import { Select, Store } from '@ngxs/store';
import { SharedState } from 'src/app/shared/state/shared.state';
import { SharedActions } from 'src/app/shared/state/shared.actions';
import { BuyerState } from 'src/app/layout/buyer/state/buyer.state';
import { BuyerActions } from 'src/app/layout/buyer/state/buyer.actions';

@Component({
  selector: 'app-product',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss']
})
export class BuyerComponent implements OnInit, OnDestroy {

  public gridData: any = [];
  data:any;
  files: any ={};
  public buyerFormData: any = {
    "buyerId": "",
    "erpBuyerLeName": "",
    "erpOuNumber": "",
    "erpOuEntityName":"",
    "locationName":"",
    "goldId": "",
    "updatedBy": "",
    "lastUpdatedDate":"",
  };


  public buyerId: any;
  public erpBuyerLeName: any;
  public erpOuNumber: any;
  public erpOuEntityName: any;
  public locationName: any;
  public goldId: any;
  public updatedBy: any;
  public lastUpdatedDate: any;
  public errorMessage = "";
  public gridLoadFlag:boolean=false;
  buyerData:any = [];
  buyerDwnData:any = [];
  public downloadCols = [];
  public fileName : any ="Buyer";
  public saveMessage: any = [];
  public popupErrorMessage: any;
  public editFlag = false;
  @ViewChild('content1') errorMessagePopUp;
  closeResult: string;
  public vendor: any = [];
  public countryCodeReferenceData: any;
  countryCodeReferenceDataList: SelectItem[] = [];
  public formMode="New";
  public userFlag = false;
  public goldNetReferenceData: any;
 goldNetIdReferenceDataList:SelectItem[] = [];

 private readonly KEY: string = 'Buyer';
 private subs: Subscription;
  
 @Select(SharedState.getCountries) countryCodeReferenceDataList$: Observable<any>
 @Select(SharedState.getUserDetails) userDetails$: Observable<any>
 @Select(BuyerState.getFetching) gridLoadFlag$: Observable<any>
 @Select(BuyerState.getBuyers) buyers$: Observable<any>
 @Select(BuyerState.getGoldIds) goldIds$: Observable<any>

  constructor(
    private buyerService: BuyerService,
    private modalService: NgbModal,
    private homeService: HomeService,
    private store: Store,
    private backupModelService: BackupModelService
  ) {
  }
  

  public cols = [
    { field: 'erpBuyerLeName', header: 'ERP Buyer Name', width: '20%' },
    { field: 'erpOuEntityName', header: 'OU Name', width: '5%' },
    { field: 'erpOuNumber', header: 'OU Number', width: '10%' },
    { field: 'locationName', header: 'Buyer Location', width: '20%' },
    { field: 'goldId', header: 'Gold ID', width: '10%' },
    { field: 'updatedBy', header: 'Updated By', width: '10%' },
    { field: 'lastUpdatedDate', header: 'Updated Date', width: '10%' },
  ];

  newAlias:string = "";
  aliases: SelectItem[] = [];
  selectedAlias:SelectItem;

  public buyerInsertData: any = {
    "erpBuyerLeName": "",
    "erpOuNumber": "",
    "erpOuEntityName":"",
    "buyerLocationId":"",
    "goldId": "",
    "updatedBy": "",
    "buyerInfo":"",
    "goldNetName":"",
    "aliases": []
  };
  public buyerInsertDataCopy: any;

  addAlias(alias){
    this.newAlias = "";
    if(!this.buyerInsertData.aliases.includes(alias)){
      this.aliases.push({label: alias, value:alias});
      this.buyerInsertData.aliases.push(alias);
    }
    console.log(this.aliases)
  }

  removeAlias(salias){
    let i = this.buyerInsertData.aliases.indexOf(salias.label);
    this.buyerInsertData.aliases.splice(i,1)
    this.aliases.splice(i,1);
  }

  async ngOnInit() {
    this.buyerInsertData.aliases = [];
    this.initStateOnComponent()
    for (let i = 0; i < this.cols.length; i++) {
      // console.log("in Download method"+i);
      this.downloadCols.push(this.cols[i].header);
    }
  }

  ngOnDestroy() {
    this.backupModelService.buyerTabModel = {
      buyerInsertData: this.buyerInsertData,
      editFlag: this.editFlag,
      formMode: this.formMode
    }
    this.homeService.setState({ key: this.KEY, data: null });
    if(this.subs != null && this.subs != undefined){
      this.subs.unsubscribe()
    }
  }

  initStateOnComponent(){
    this.store.dispatch(new SharedActions.FetchCountry())
    this.store.dispatch(new BuyerActions.FetchBuyers())
    this.store.dispatch(new BuyerActions.FetchGoldIds())
    this.store.dispatch(new BuyerActions.FetchGoldIds())
    this.userDetails$.subscribe(({ roleNM }) => this.userFlag = roleNM !== 'ADMIN')
    this.gridLoadFlag$.subscribe(isFetching => this.gridLoadFlag = !isFetching)
    this.countryCodeReferenceDataList$.subscribe(items => {
      this.countryCodeReferenceDataList = items.map(({ countryCode, countryName, countryId }) => ({ 
        label: `${countryCode} | ${countryName}`, 
        value: countryId
      }))
      this.countryCodeReferenceDataList.unshift({ label: "Select", value: "Select" })
    })
    this.buyers$.subscribe(items =>{
      this.buyerData = items;
      this.buyerDwnData = items.map(item => {
        return {
          erpBuyerLeName: item.erpBuyerLeName,
          erpOuEntityName: item.erpOuEntityName,
          erpOuNumber: item.erpOuNumber,
          locationName: item.locationName,
          goldId: this.goldId,
          updatedBy: this.updatedBy,
          lastUpdatedDate: this.lastUpdatedDate,
        }
      })
      this.initTreeSubscribe()
    })
    this.goldIds$.subscribe(items => {
      this.goldNetReferenceData = items
      this.goldNetIdReferenceDataList = items.map( ({goldId, goldnetName, countryCode}) => ({ label: `${goldId} | ${goldnetName} | ${countryCode}`, value: goldId }) )
      this.goldNetIdReferenceDataList.unshift({ label: "Select", value: "Select" })
    })
  }

  initTreeSubscribe() {
    if(this.backupModelService.buyerTabModel != null 
      && this.backupModelService.buyerTabModel != undefined){
        this.buyerInsertData = this.backupModelService.buyerTabModel.buyerInsertData;
        this.editFlag = this.backupModelService.buyerTabModel.editFlag;
        this.formMode = this.backupModelService.buyerTabModel.formMode;
      }
    this.subs = this.homeService.state$.subscribe(({ [this.KEY]: item }) => {
      if(item) {
        const { id } = item;
        this.showSelectedData(id);
      }
    });
  }

  showSelectedData(buyerId) {
    this.editFlag = true;
    this.formMode="Modify";
    const modelTemp = this.buyerData.find(x => x.buyerId == buyerId);
    this.buyerInsertData = { ...modelTemp };
    this.buyerService.getBuyerAliases(modelTemp.buyerId).subscribe((data)=>{
      this.buyerInsertData.aliases = data;
      this.buyerInsertDataCopy = { ...this.buyerInsertData }
    });
  }

  clearAllFilters(){
    this.editFlag = false;
    this.formMode = "New";
    this.buyerInsertData={
      erpBuyerLeName:"",
      erpOuNumber: "",
      erpOuEntityName:"",
      buyerLocationId:"",
      goldId: "",
      updatedBy: "",
      buyerInfo:"",
      goldNetName:""
    }
    this.errorMessage ="";
    this.buyerInsertDataCopy = {}
  }

  validation(){
    if(this.buyerInsertData.erpBuyerLeName==""){
      this.errorMessage = "Please Enter Buyer ERP Le Name";
      return false;
    }
    // if(this.buyerInsertData.erpOuEntityName==""){
    //   this.errorMessage = "Please Enter ERP OU Entity Name";
    //   return false;
    // }
    // if(this.buyerInsertData.erpOuNumber==""){
    //   this.errorMessage = "Please Enter ERP OU Number";
    //   return false;
    // }
    // if(this.buyerInsertData.buyerInfo==""){
    //   this.errorMessage = "Please Enter Buyer info";
    //   return false;
    // }
    if(this.buyerInsertData.buyerLocationId=="Select" || this.buyerInsertData.buyerLocationId==""){
      this.errorMessage = "Please Enter Buyer Location";
      return false;
    }
    // if(this.buyerInsertData.goldId==""){
    //   this.errorMessage = "Please Enter Gold ID";
    //   return false;
    // }
    else{
      return true;
    }
  }

  async upsertBuyer() {
    this.errorMessage = "";
    //this.msgs = [];
    if (this.validation()) {
      try{
        await this.store.dispatch(new  BuyerActions.UpsertBuyer(this.buyerInsertData)).toPromise()
        this.clearAllFilters()
      }catch(e){}
    }
  }

  get disabled() {
    if (this.editFlag) {
      console.log('Model')
      console.log(this.buyerInsertData);
      console.log('Copy')
      console.log(this.buyerInsertDataCopy);
      return JSON.stringify(this.buyerInsertData) === JSON.stringify(this.buyerInsertDataCopy)
    }
    return false;
  }
}
