import { Component, OnInit, ViewChild } from '@angular/core';
import { VendorService } from './vendor.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

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
    "vendorLegalEntityName":"",
    "active": true,
    // "createdBy":"503148032",
    // "updatedBy":"503148032"
  };

  public vendorEntityId: any;
  public vendorLegalEntityName: any;
  public active: any;
  public lastUpdatedDate: any;
  public updatedBy: any;
  public createdBy: any;
  public createdDate: any;
  public errorMessage = "";
  public gridLoadFlag:boolean=false;
  vendorData:any = [];
  venDwnData:any = [];
  public downloadCols = [];
  public fileName : any ="VSC";
  public saveMessage: any = [];
  public popupErrorMessage: any;
  public editFlag = false;
  @ViewChild('content1') errorMessagePopUp;
  closeResult: string;
  public vendor: any = [];
  
  constructor(private vendorService: VendorService,private modalService: NgbModal) { }
  

  public cols = [
    { field: 'vendorLegalEntityName', header: 'Vendor Name', width: '10%' },
    { field: 'active', header: 'Active', width: '5%' },
    { field: 'updatedBy', header: 'Updated By', width: '10%' },
    { field: 'lastUpdatedDate', header: 'Updated Date', width: '10%' },
  ];

  ngOnInit() {
    this.getAllVendorDetails();
    for (let i = 0; i < this.cols.length; i++) {
      // console.log("in Download method"+i);
      this.downloadCols.push(this.cols[i].header);
    }       
  }

  getAllVendorDetails() {
    this.vendorService.getVendorDetails().subscribe(
      refData => {
        this.vendorData=refData;
        this.gridLoadFlag = true;

        this.vendorData.map(item => {
          return {
              vendorLegalEntityName: item.vendorLegalEntityName,
              active: item.active,
              updatedBy: item.updatedBy,
              lastUpdatedDate: item.lastUpdatedDate
          }
      }).forEach(item => this.venDwnData.push(item));
      },
      error => {
      });
  }

  showSelectedData(vendorEntityId,vendorLegalEntityName,active,updatedBy) {  
      console.log("radio button click" + vendorEntityId);
      this.editFlag = true;
      this.vendorInsertData = this.vendorData.filter(x => x.vendorEntityId == vendorEntityId)[0];
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
  }

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

  upsertVendor() {
    this.errorMessage = "";
    //this.msgs = [];
    console.log("test button click");
    if (this.validation()) {
      this.vendorInsertData.createdBy="503148032";
      this.vendorInsertData.updatedBy="503148032";
      this.vendorService.saveOrUpdateVendor(this.vendorInsertData).subscribe(
        refData => {
          this.saveMessage = refData;
          if(!this.saveMessage.Error == undefined)
            this.errorMessagePopUp = "Vendor Already Exits";
          if(this.saveMessage.Error == false)
            this.errorMessagePopUp = "Vendor Name "+this.vendorInsertData.vendorLegalEntityName+" Save Suceesfully.";
          else
            this.errorMessagePopUp =  "Vendor Name "+this.vendorInsertData.vendorLegalEntityName+" not Saved, Reason: Vendor Already Exits";
          this.open(this.errorMessagePopUp);
          this.getAllVendorDetails();
          this.cancel();
        },
        error => {
        });
    }else{
      //this.open(this.errorMessage);
    }
  }

  clearAllFilters() {
    this.errorMessage = "";
   /*  this.messageService.clear();
    this.msgs = []; */
    this.editFlag = false;
    this.vendorFormData = {
      vendorLegalEntityName: "Select",
      active: true,
      lastUpdatedDate: "",
      createdDate: "",
      createdBy: "",
      updatedBy: true
    };
    this.popupErrorMessage = "";
  }
}
