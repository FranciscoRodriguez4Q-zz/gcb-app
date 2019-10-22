import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { ProductService } from './product.service';
import { Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '../../shared/constants/globals';
import { HomeService } from '../home/home.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  //Dropdown Lists
  billProcessReferenceList: SelectItem[] = [];
  public billProcessReference: any;
  productTypeReferenceList: SelectItem[] = [];
  public productTypeReference: any;
  unspscReferenceList: SelectItem[] = [];
  public unspscReference: any;
  public downloadCols = [];
  productDwnData: any = [];
  public products: any = [];
  public gcbDwnData: any = [];
  public editFlag = false;
  public errorMessage = "";
  public saveMessage: any = [];
  @ViewChild('content1') errorMessagePopUp;
  public popupErrorMessage: any;
  closeResult: string;
  public formMode = "New";
  public gridLoadFlag: boolean = false;
  public userFlag = false;
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

  constructor(
    private router: Router,
    private productService: ProductService,
    private modalService: NgbModal,
    private globals: Globals,
    private homeService: HomeService,
  ) {
    if (this.globals.roleNM === 'ADMIN') {
      this.userFlag = false;
    }
    else {
      this.userFlag = true;
    }
  }

  async ngOnInit() {
    await this.getProductDetails();
    for (let i = 0; i < this.cols.length; i++) {
      this.downloadCols.push(this.cols[i].header);
    }
    await this.getBillProcess();
    //this.getProductType();
    await this.getUnspsc();
    this.subs = this.homeService.state$.subscribe(({ [this.KEY]: item }) => {
      if (item) {
        const { id } = item;
        this.showSelectedData(id);
      }
    })
  }

  ngOnDestroy() {
    this.homeService.setState({ key: this.KEY, data: null });
    this.subs.unsubscribe();
  }

  getProductDetails() {
    return this.productService.getProductDetails().toPromise().then(
      refData => {
        this.products = refData;
        this.gridLoadFlag = true;
        this.products.map(item => {
          return {
            billProcessName: item.billProcessName,
            productName: item.productName,
            productCode: item.productCode,
            //productType: item.productType, 
            unspsc: item.unspsc,
            updatedBy: item.updatedBy,
            lastUpdated: item.lastUpdated
          }
        }).forEach(item => this.productDwnData.push(item));
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     this.products = refData;
    //     this.gridLoadFlag = true;
    //     this.products.map(item => {
    //       return {
    //         billProcessName: item.billProcessName,
    //         productName: item.productName,
    //         productCode: item.productCode,
    //         //productType: item.productType, 
    //         unspsc: item.unspsc,
    //         updatedBy: item.updatedBy,
    //         lastUpdated: item.lastUpdated
    //       }
    //     }).forEach(item => this.productDwnData.push(item));
    //   },
    //   error => {}
    // );
  }

  getBillProcess() {
    return this.productService.getBillProcessList().toPromise().then(
      refData => {
        let arr: any = [];
        this.billProcessReference = refData;
        this.billProcessReferenceList.push({ label: "Select", value: "Select" });
        for (let data of this.billProcessReference) {
          this.billProcessReferenceList.push({ label: data.processName, value: data.billProcessId })
        }
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     let arr: any = [];
    //     this.billProcessReference = refData;
    //     this.billProcessReferenceList.push({ label: "Select", value: "Select" });
    //     for (let data of this.billProcessReference) {
    //       this.billProcessReferenceList.push({ label: data.processName, value: data.billProcessId })
    //     }
    //   },
    //   error => {
    //   });
  }

  // getProductType(){
  // this.productTypeReferenceList.push({ label: "Select", value: "Select" });
  // this.productTypeReferenceList.push({ label: "MASTER", value: "MASTER" });
  // this.productTypeReferenceList.push({ label: "INDIVIDUAL", value: "INDIVIDUAL" });
  // }

  getUnspsc() {
    return this.productService.getUnspsc().toPromise().then(
      refData => {
        let arr: any = [];
        this.unspscReference = refData;
        this.unspscReferenceList.push({ label: "Select", value: "Select" });
        for (let data of this.unspscReference) {
          this.unspscReferenceList.push({ label: data.unspscCode, value: data.unspscCode })
        }
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     let arr: any = [];
    //     this.unspscReference = refData;
    //     this.unspscReferenceList.push({ label: "Select", value: "Select" });
    //     for (let data of this.unspscReference) {
    //       this.unspscReferenceList.push({ label: data.unspscCode, value: data.unspscCode })
    //     }
    //   },
    //   error => {
    //   });

    //this.unspscReferenceList.push({ label: "Select", value: "Select" });
    //this.unspscReferenceList.push({ label: "81.11.17.00.00", value: "81.11.17.00.00" });
    //this.unspscReferenceList.push({ label: "84.11.00.00.00", value: "84.11.00.00.00" });
  }

  showSelectedData(productId) {
    console.log("radio button click" + productId);
    window.scroll(0,0);
    this.editFlag = true;
    this.gcbProductFilters = this.products.filter(x => x.productId == productId)[0];
    this.gcbProductFiltersCopy = { ...this.gcbProductFilters };
    this.formMode = "Modify";
  }

  upsertProduct() {
    this.errorMessage = "";
    console.log("test button click");
    if (this.validation()) {
      if (this.validation) {
        this.productService.upsertProduct(this.gcbProductFilters).subscribe(
          refData => {
            this.saveMessage = refData;
            this.popupErrorMessage = this.saveMessage.statusMessage;
            console.log(this.saveMessage);
            this.open(this.errorMessagePopUp);
            this.getProductDetails();
            if (!this.saveMessage.Error) {
              this.clearAllFilters();
            }
          },
          error => {
          });
      }
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

  /**
 * Method to open modal pop up.
 * @param: content: @ViewChild
 */
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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



