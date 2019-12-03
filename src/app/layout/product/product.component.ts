import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { ProductService } from './product.service';
import { Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '../../shared/constants/globals';
import { HomeService } from '../home/home.service';
import { Subscription, Observable } from 'rxjs';
import { BackupModelService } from '../backupmodel.service';
import { Store, Select } from '@ngxs/store';
import { ProductState } from './state/product.state';
import { Product } from './state/product.model';
import { ProductActions } from './state/product.action';
import { SharedActions } from '../../shared/state/shared.actions'
import { SharedState } from '../../shared/state/shared.state';
import * as  _ from 'lodash'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  //Dropdown Lists
  public billProcessReferenceList: SelectItem[] = [];
  public productTypeReferenceList: SelectItem[] = [];
  // public unspscReferenceList: SelectItem[] = [];
  // public unspscReference: any;
  public downloadCols = [];
  public productDwnData: any = [];
  public products: any = [];
  public gcbDwnData: any = [];
  public editFlag = false;
  public errorMessage = "";
  public formMode = "New";
  public userFlag = false;
  public gridLoadFlag: boolean;
  private readonly KEY: string = 'Product'
  private subs: Subscription;

  public fileName: any = "Product";
  public cols = [
    { field: 'billProcessName', header: 'Process Name', width: '15%' },
    { field: 'productName', header: 'Product Name', width: '15%' },
    { field: 'productCode', header: 'Product Code', width: '15%' },
    // { field: 'productType', header: 'Product Type', width: '15%' },
    { field: 'unspsc', header: 'UNSPSC', width: '15%' },
    { field: 'updatedBy', header: 'Updated By', width: '15%' },
    { field: 'lastUpdated', header: 'Updated Date', width: '15%' },
  ];

  public gcbProductFilters: any = {
    productId: "",
    productName: "",
    billProcessName: "",
    billProcessId: "Select",
    productCode: "",
    tDescriptionDesiredValue: "",
    // productType: "",
    //productTypeId: "Select",
    unspsc: "",
    upspscId: "Select"
  }
  public gcbProductFiltersCopy: any;

  @Select(ProductState.getProducts) products$: Observable<Product[]>
  @Select(ProductState.getProductsFetching) gridLoadFlag$: Observable<boolean>
  @Select(SharedState.getBillProcesses) billProcessReferenceList$: Observable<[]>
  @Select(SharedState.getUserDetails) userDetails$: Observable<any>

  public totalRecords;

  constructor(
    private homeService: HomeService,
    private backupModelService: BackupModelService,
    private store: Store
  ) { }


  async ngOnInit() {
    this.initStateOnComponent()
    this.downloadCols = this.cols.map(({ header }) => header)
    this.subs = this.homeService.state$.subscribe(({ [this.KEY]: item }) => {
      if (item) {
        const { id } = item;
        const product = this.products.find(x => x.productId === id)
        this.showSelectedData(product);
      }
    });
    if(this.backupModelService.productTabModel != null 
      && this.backupModelService.productTabModel != undefined){
        this.gcbProductFilters = this.backupModelService.productTabModel.gcbProductFilters;
        this.formMode = this.backupModelService.productTabModel.formMode;
        this.editFlag = this.backupModelService.productTabModel.editFlag;
      }
  }

  initStateOnComponent() {
    this.store.dispatch(new ProductActions.FetchProducts())
    this.store.dispatch(new SharedActions.FetchBillProcesses())
    this.userDetails$.subscribe(({ roleNM }) => this.userFlag = roleNM !== 'ADMIN')
    this.products$.subscribe(items => this.getProductDetails(items))
    this.gridLoadFlag$.subscribe(band => this.gridLoadFlag = band)
    this.billProcessReferenceList$.subscribe(items => this.getBillProcess(items))
  }

  ngOnDestroy() {
    this.backupModelService.productTabModel = {
      gcbProductFilters: this.gcbProductFilters,
      formMode: this.formMode,
      editFlag: this.editFlag
    }
    this.homeService.setState({ key: this.KEY, data: null });
    if(this.subs != null && this.subs != undefined){
      this.subs.unsubscribe()
    }
  }

  getProductDetails(items) {
    this.products = items
    this.productDwnData = items.map(item => ({
      billProcessName: item.billProcessName,
      productName: item.productName,
      productCode: item.productCode,
      unspsc: item.unspsc,
      updatedBy: item.updatedBy,
      lastUpdated: item.lastUpdated
    }))
  }

  getBillProcess(items) {
    this.billProcessReferenceList = items.map(({ processName, billProcessId }) => ({ label: processName, value: billProcessId }))
    this.billProcessReferenceList.unshift({ label: "Select", value: "Select" });
  }

  // getProductType(){
  // this.productTypeReferenceList.push({ label: "Select", value: "Select" });
  // this.productTypeReferenceList.push({ label: "MASTER", value: "MASTER" });
  // this.productTypeReferenceList.push({ label: "INDIVIDUAL", value: "INDIVIDUAL" });
  // }

  // getUnspsc() {
  //   return this.productService.getUnspsc().toPromise().then(
  //     refData => {
  //       let arr: any = [];
  //       this.unspscReference = refData;
  //       this.unspscReferenceList.push({ label: "Select", value: "Select" });
  //       for (let data of this.unspscReference) {
  //         this.unspscReferenceList.push({ label: data.unspscCode, value: data.unspscCode })
  //       }
  //     }
  //   ).catch(console.log)
  // }

  showSelectedData(productData) {
    window.scroll(0,0);
    this.editFlag = true;
    this.gcbProductFilters = { ...productData }
    this.gcbProductFiltersCopy = { ...this.gcbProductFilters };
    this.formMode = "Modify";
  }

  upsertProduct() {
    if (this.validation()) {
      this.store.dispatch(new ProductActions.UpsertProduct(this.gcbProductFilters))
      this.clearAllFilters()
    }
  }

  validation() {
    if (this.gcbProductFilters.billProcessName == "Select") {
      this.errorMessage = "Please select Process Name";
      return false;
    }
    if (this.gcbProductFilters.productName == "") {
      this.errorMessage = "Please Enter Product Name ";
      return false;
    }
    if (this.gcbProductFilters.productCode == "") {
      this.errorMessage = "Please Enter Product Code ";
      return false;
    }
    // if (this.gcbProductFilters.tDescriptionDesiredValue == "") {
    //   this.errorMessage = "Please Enter T Description Prefix Text";
    //    return false;
    // }
    // if (this.gcbProductFilters.productType == "Select") {
    //   this.errorMessage = "Please select Product Type";
    //    return false;
    // }
    // if (this.gcbProductFilters.unspsc == "Select") {
    //   this.errorMessage = "Please select UNSPSC";
    //    return false;
    // }

    return true;
  }

  clearAllFilters() {
    this.errorMessage = "";
    /*  this.messageService.clear();
     this.msgs = []; */
    this.editFlag = false;
    this.formMode = "New";
    this.gcbProductFilters = {
      productId: "",
      productName: "",
      billProcessName: "",
      billProcessId: "Select",
      productCode: "",
      tDescriptionDesiredValue: "",
      productType: "",
      productTypeId: "Select",
      unspsc: "",
      upspscId: "Select"
    };
    this.gcbProductFiltersCopy = {}
  }

  get disabled() {
    if (this.editFlag) {
      return JSON.stringify(this.gcbProductFilters) === JSON.stringify(this.gcbProductFiltersCopy)
    }
    return false;
  }

}



