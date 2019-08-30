import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { ProductService } from './product.service';
import {Router} from "@angular/router";


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

  public fileName : any ="Product";
  public cols = [
    { field: 'productName', header: 'Product Name', width: '15%' },
    { field: 'serviceTypePrefixSuggestion', header: 'Serice Type Prefix', width: '15%' },
    { field: 'processName', header: 'Process Name', width: '15%' },
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

  constructor(private router: Router,private productService:ProductService) { }

  ngOnInit() { 

    for (let i = 0; i < this.cols.length; i++) {
      this.downloadCols.push(this.cols[i].header);
      //this.downloadCols[this.cols[i].header] = "";
    }
    this.getBillProcess();
    this.getProductType();
    this.getUnspsc();

   
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
      this.productTypeReferenceList.push({ label: "Master", value: "Master" });
      this.productTypeReferenceList.push({ label: "Individual", value: "Individual" });
      }

      getUnspsc(){
        this.unspscReferenceList.push({ label: "Select", value: "Select" });
        this.unspscReferenceList.push({ label: "81.11.17.00.00", value: "81.11.17.00.00" });
        this.unspscReferenceList.push({ label: "84.11.00.00.00", value: "84.11.00.00.00" });
    }
  }



