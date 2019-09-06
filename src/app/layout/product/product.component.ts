import { Component, OnInit,ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { ProductService } from './product.service';
import {Router} from "@angular/router";
import { NgbModal ,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  //Dropdown Lists
  billProcessReferenceList: SelectItem[] = [];
  public billProcessReference: any;
  productTypeReferenceList: SelectItem[] = [];
  public productTypeReference: any;
  unspscReferenceList: SelectItem[] = [];
  public unspscReference: any;
  public downloadCols = [];
  
  public products: any = [];
  public gcbDwnData: any = [];
  public editFlag = false;
  public errorMessage = "";
  public saveMessage: any = [];
  @ViewChild('content1') errorMessagePopUp;
  public popupErrorMessage: any;
  closeResult: string;
  public formMode="New";


  public fileName : any ="Product";
  public cols = [
    { field: 'productName', header: 'Product Name', width: '15%' },
    { field: 'serviceTypePrefixSuggestion', header: 'Service Type Prefix', width: '15%' },
    { field: 'billProcessName', header: 'Process Name', width: '15%' },
    { field: 'unspsc', header: 'UNSPSC', width: '15%' },
    { field: 'lastUpdated', header: 'Updated By', width: '15%' },
    { field: 'updatedBy', header: 'Updated Date', width: '15%' },
  ];

  public gcbProductFilters:any={
    productId: "",
    productName: "",
    billProcessName: "",
    billProcessId: "Select",
    serviceTypePrefixSuggestion: "",
    tDescriptionDesiredValue: "",
    productType: "",
    productTypeId: "Select",
    unspsc: "",
    upspscId: "Select"
  }

  constructor(private router: Router,private productService:ProductService , private modalService: NgbModal) { }

  ngOnInit() { 

    for (let i = 0; i < this.cols.length; i++) {
      this.downloadCols.push(this.cols[i].header);
      //this.downloadCols[this.cols[i].header] = "";
    }
    this.getProductDetails();
    this.getBillProcess();
    this.getProductType();
    this.getUnspsc();

   
    }

    getProductDetails(){
      this.productService.getProductDetails().subscribe(
        refData =>{
          this.products=refData;
          this.gcbDwnData = refData;
        },
        error =>{

        }
      );
    }
    getBillProcess(){
    this.productService.getBillProcessList().subscribe(
      refData => {
        let arr: any = [];
        this.billProcessReference = refData;
        this.billProcessReferenceList.push({ label: "Select", value: "Select" });
        for (let data of this.billProcessReference) {
          this.billProcessReferenceList.push({ label: data.processName, value: data.billProcessId })
        }
      },
      error => {
      });
    }

      getProductType(){
      this.productTypeReferenceList.push({ label: "Select", value: "Select" });
      this.productTypeReferenceList.push({ label: "MASTER", value: "MASTER" });
      this.productTypeReferenceList.push({ label: "INDIVIDUAL", value: "INDIVIDUAL" });
      }

      getUnspsc(){
        this.unspscReferenceList.push({ label: "Select", value: "Select" });
        this.unspscReferenceList.push({ label: "81.11.17.00.00", value: "81.11.17.00.00" });
        this.unspscReferenceList.push({ label: "84.11.00.00.00", value: "84.11.00.00.00" });
    }

    showSelectedData(productId) {
      console.log("radio button click" + productId);
      this.editFlag = true;
      this.formMode="Modify";
      this.gcbProductFilters = this.products.filter(x => x.productId == productId)[0];
    }

    upsertProduct() {
      this.errorMessage = "";
      console.log("test button click");
      if (this.validation()) {
        if (this.validation) {
          this.productService.upsertProduct(this.gcbProductFilters).subscribe(
            refData => {
              this.saveMessage = refData;
              //this.errorMessage = this.saveMessage.statusMessage;
             /*  this.msgs = [];
              this.msgs.push({ severity: 'error', summary: this.errorMessage, detail: '' }); */
              this.popupErrorMessage =  this.saveMessage.statusMessage;
              this.open(this.errorMessagePopUp);
              this.getProductDetails();
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
      if (this.gcbProductFilters.serviceTypePrefixSuggestion == "") {
        this.errorMessage = "Please Enter Service Type Prefix Suggestion ";
        return false;
      }
      if (this.gcbProductFilters.tDescriptionDesiredValue == "") {
        this.errorMessage = "Please Enter T Description Prefix Text";
         return false;
      }
      if (this.gcbProductFilters.productType == "Select") {
        this.errorMessage = "Please select Product Type";
         return false;
      }
      if (this.gcbProductFilters.unspsc == "Select") {
        this.errorMessage = "Please select UNSPSC";
         return false;
      }
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
      this.gcbProductFilters = {
        productId: "",
        productName: "",
        billProcessName: "",
        billProcessId: "Select",
        serviceTypePrefixSuggestion: "",
        tDescriptionDesiredValue: "",
        productType: "",
        productTypeId: "Select",
        unspsc: "",
        upspscId: "Select"
      };
      this.popupErrorMessage = "";
      this.getProductDetails();
    }

  }



