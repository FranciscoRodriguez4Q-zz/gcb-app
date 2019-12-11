import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { ProductServiceTypeService } from './product-service-type.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '../../shared/constants/globals';
import { HomeService } from '../home/home.service';
import { Subscription, Observable } from 'rxjs';
import { BackupModelService } from '../backupmodel.service';
import { Store, Select } from '@ngxs/store';
import { SharedActions } from 'src/app/shared/state/shared.actions';
import { SharedState } from 'src/app/shared/state/shared.state';
import { ProductServiceTypeActions } from 'src/app/layout/product-service-type/state/product-service-type.action';
import { ProductServiceTypeState } from 'src/app/layout/product-service-type/state/product-service-type.state';
import { ProductServiceType } from 'src/app/layout/product-service-type/state/product-service-type.model';

@Component({
  selector: 'app-product-service-type',
  templateUrl: './product-service-type.component.html',
  styleUrls: ['./product-service-type.component.scss'],
  providers: [ProductServiceTypeService, MessageService]

})
export class ProductServiceTypeComponent implements OnInit, OnDestroy {
  public serviceTypes: any = [];
  productReferenceDataList: SelectItem[] = [];
  public productReferenceData: any;
  countryCodeReferenceDataList: SelectItem[] = [];
  public countryCodeReferenceData: any;
  billingReferenceDataList: SelectItem[] = [];
  public billingBasisReferenceData: any;
  public gcbDwnData: any = [];
  public downloadCols = [];
  public fileName: any = "ServiceType";
  public gridLoadFlag: boolean = false;
  public userFlag: boolean = true;
  private readonly KEY: string = 'ProductServiceType'
  private subs: Subscription;

  public billProcessReference: any;
  public gcbDetailFilters: any = {
    productId: "Select",
    productNm: "",
    billedFromLocationId: "Select",
    billedToLocationId: "Select",
    billingBasis: "Select",
    serviceTypeName: "",
    suggestedServiceType: "",
    serviceTypeMessage: "",
    useSuggested: true,
    vatPercent: "",
    whtPercent: "",
    tpPercent: "",
    unspscOverride: false,
    unspsc: "",
    costCenter: "",
    legacyServiceTypeName: "",
    processName: ""
  };
  public gcbDetailFiltersCopy: any;
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
  public formMode = "New";
  public errorMessage = "";
  public saveMessage: any = [];
  @ViewChild('content1') errorMessagePopUp;
  public popupErrorMessage: any;
  closeResult: string;

  @Select(SharedState.getCountries) countryCodeReferenceDataList$: Observable<any>
  @Select(SharedState.getUserDetails) userDetails$: Observable<any>
  @Select(SharedState.getBillProcesses) billProcesses$: Observable<any>
  @Select(ProductServiceTypeState.getProductServiceTypes) productServiceTypes$: Observable<ProductServiceType>
  @Select(ProductServiceTypeState.getFetching) isFetching$: Observable<boolean>
  @Select(ProductServiceTypeState.getProductData) productData$: Observable<any>

  constructor(
    private productServiceTypeService: ProductServiceTypeService,
    private modalService: NgbModal,
    private globals: Globals,
    private homeService: HomeService,
    private backupModelService: BackupModelService,
    private store: Store
  ) {
    // if (this.globals.roleNM === 'ADMIN') {
    //   this.userFlag = false;
    // }
    // else {
    //   this.userFlag = true;
    // }
  }

  async ngOnInit() {
    this.initStateOnComponent()
    this.cols.forEach((_col) => this.downloadCols.push(_col.header))
    //await this.getAllProductData();
    // await this.getAllCountryData();
    this.getBillingBasisData();
  }

  initStateOnComponent() {
    this.store.dispatch(new SharedActions.FetchCountry())
    this.store.dispatch(new SharedActions.FetchBillProcesses())
    this.store.dispatch(new ProductServiceTypeActions.FetchProductServiceTypes())
    this.store.dispatch(new ProductServiceTypeActions.FetchProductData())
    this.userDetails$.subscribe(({ roleNM }) => this.userFlag = roleNM !== 'ADMIN')
    this.countryCodeReferenceDataList$.subscribe(items => {
      this.countryCodeReferenceDataList = items.map(({ countryCode, countryName, countryId }) => ({ 
        label: `${countryCode} | ${countryName}`, 
        value: countryId
      }))
      this.countryCodeReferenceData = items

    })
    this.billProcesses$.subscribe( _billProcess => this.billProcessReference = _billProcess)
    this.productServiceTypes$.subscribe( (_serviceTypes) =>{
      this.serviceTypes = _serviceTypes;
      this.gcbDwnData = _serviceTypes;
      this.initTreeSubscribe()
    })
    this.isFetching$.subscribe( is => this.gridLoadFlag = true)
    this.productData$.subscribe( (_productData) => {
      this.productReferenceData = _productData;
      this.productReferenceDataList = _productData.map( ({productCode, productName, productId}) => ({ label: `${productCode} | ${productName}`, value: productId }) )
      this.productReferenceDataList.unshift({ label: "Select", value: "Select" })
    })
  }

  initTreeSubscribe() {
    if(this.backupModelService.serviceTypeTabModel != null 
      && this.backupModelService.serviceTypeTabModel != undefined){
        this.gcbDetailFilters = this.backupModelService.serviceTypeTabModel.gcbDetailFilters;
        this.editFlag = this.backupModelService.serviceTypeTabModel.editFlag;
        this.formMode = this.backupModelService.serviceTypeTabModel.formMode;
      }
    this.subs = this.homeService.state$.subscribe(({ [this.KEY]: item }) => {
      if (item) {
        const { id } = item;
        this.showSelectedData(id);
      }
    });
  }

  ngOnDestroy() {
    this.backupModelService.serviceTypeTabModel = {
      gcbDetailFilters:this.gcbDetailFilters,
      editFlag: this.editFlag,
      formMode: this.formMode
    }
    this.homeService.setState({ key: this.KEY, data: null });
    if(this.subs != null && this.subs != undefined){
      this.subs.unsubscribe()
    }
  }

  getBillingBasisData() {
    /*this.productServiceTypeService.getBillingBasis().subscribe(
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

  getServicetype() {
    this.errorMessage = "";
    if (this.gcbDetailFilters.productId != "Select") {
      let productData = this.productReferenceData.filter(x => x.productId == this.gcbDetailFilters.productId)[0];
      let billProcessData = this.billProcessReference.filter(y => y.billProcessId == productData.billProcessId)[0];
      this.gcbDetailFilters.unspsc = productData.unspsc;
      this.gcbDetailFilters.processName = billProcessData.processName;
    }
    if (this.gcbDetailFilters.productId != "Select" && this.gcbDetailFilters.billedFromLocationId != "Select" && this.gcbDetailFilters.billedToLocationId != "Select") {
      let productData = this.productReferenceData.filter(x => x.productId == this.gcbDetailFilters.productId)[0];
      console.log("Product Selected : " + productData);
      let fromCountry = this.countryCodeReferenceData.filter(x => x.countryId == this.gcbDetailFilters.billedFromLocationId)[0];
      let toCountry = this.countryCodeReferenceData.filter(x => x.countryId == this.gcbDetailFilters.billedToLocationId)[0];
      this.gcbDetailFilters.serviceTypeName = productData.productCode + "_" + fromCountry.countryCode + "_2" + toCountry.countryCode;
      console.log("Product this.gcbDetailFilters.suggestedServiceType : " + this.gcbDetailFilters.serviceType);
      this.gcbDetailFilters.suggestedServiceType = this.gcbDetailFilters.serviceTypeName;
      this.gcbDetailFilters.legacyServiceTypeName = this.gcbDetailFilters.serviceTypeName;
    }

  }

  async upsertServiceType() {
    if (this.validation()) {
      if (this.gcbDetailFilters.productId != "Select" && this.gcbDetailFilters.countryCode != "Select" && this.gcbDetailFilters.billingBasis != "Select") {
        try{
          await this.store.dispatch(new ProductServiceTypeActions.UpsertProductServiceType(this.gcbDetailFilters))
          this.clearAllFilters();
        }catch(e){}
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

  clearAllFilters() {
    this.errorMessage = "";
    /*  this.messageService.clear();
     this.msgs = []; */
    this.editFlag = false;
    this.formMode = "New";
    this.gcbDetailFilters = {
      productId: "Select",
      productNm: "",
      billedFromLocationId: "Select",
      billedToLocationId: "Select",
      billingBasis: "Select",
      serviceTypeName: "",
      suggestedServiceType: "",
      serviceTypeMessage: "",
      useSuggested: true,
      vatPercent: "",
      whtPercent: "",
      tpPercent: "",
      unspscOver: "",
      unspscOverride: false,
      costCenter: "",
      processName: ""
    };
    this.gcbDetailFiltersCopy = {};
  }

  showSelectedData(serviceTypeId) {
    console.log("radio button click" + serviceTypeId);
    this.editFlag = true;
    const test = this.serviceTypes.find(x => x.serviceTypeId == serviceTypeId)
    this.gcbDetailFilters = { ...test }
    this.gcbDetailFiltersCopy = { ...this.gcbDetailFilters };
    this.formMode = "Modify";
  }

  get disabled() {
    if (this.editFlag) {
      return JSON.stringify(this.gcbDetailFilters) === JSON.stringify(this.gcbDetailFiltersCopy);
    }
    return false;
  }

  get legacyServiceTypeEnableFlag() {
    const { processName } = this.gcbDetailFilters
    return processName === 'ITEMS' ? false : true
  }

} 
