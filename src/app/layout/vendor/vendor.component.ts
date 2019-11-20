import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { VendorService } from './vendor.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SelectItem } from 'primeng/primeng';
import { Globals } from '../../shared/constants/globals';
import { HomeService } from '../home/home.service';
import { Subscription } from 'rxjs';
import { BackupModelService } from '../backupmodel.service';

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
  
  constructor(
    private vendorService: VendorService,
    private modalService: NgbModal,
    private globals: Globals,
    private homeService: HomeService,
    private backupModelService: BackupModelService
    ) { 
    //console.log("Role: "+this.globals.roleNM);
    if (this.globals.roleNM==='ADMIN') {
      this.userFlag = false;
    }
    else {
      this.userFlag = true;
    }
  }
  

  public cols = [
    { field: 'hlVendorName', header: 'HL Vendor', width: '10%' },
    { field: 'vendorLegalEntityName', header: 'Vendor Name', width: '10%' },
    { field: 'active', header: 'Active', width: '5%' },
    { field: 'updatedBy', header: 'Updated By', width: '10%' },
    { field: 'lastUpdatedDate', header: 'Updated Date', width: '10%' },
  ];

  async ngOnInit() {
    await this.getAllVendorDetails();
    for (let i = 0; i < this.cols.length; i++) {
      // console.log("in Download method"+i);
      this.downloadCols.push(this.cols[i].header);
    } 
    await this.getAllHlVendorData();
    this.subs = this.homeService.state$.subscribe(({ [this.KEY]: item }) => {
      if (item) {
        const { id } = item;
        this.showSelectedData(id);
      }
    });
    if (this.backupModelService.vendorTabModel != null 
      && this.backupModelService.vendorTabModel != undefined){
        this.vendorInsertData = this.backupModelService.vendorTabModel.vendorInsertData;
        this.formMode = this.backupModelService.vendorTabModel.formMode;
        this.editFlag = this.backupModelService.vendorTabModel.editFlag;
      }
  }

  getAllVendorDetails() {
    return this.vendorService.getVendorDetails().toPromise().then(
      refData => {
        this.vendorData = refData;
        this.gridLoadFlag = true;

        this.venDwnData = this.vendorData.map(item => {
          return {
            hlVendorName: item.hlVendorName,
            vendorLegalEntityName: item.vendorLegalEntityName,
            active: item.active,
            updatedBy: item.updatedBy,
            lastUpdatedDate: item.lastUpdatedDate
          }
        })
        console.log('this.venDwnData', this.venDwnData)

        // this.venDwnData = this.vendorData;
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     this.vendorData=refData;
    //     this.gridLoadFlag = true;

    //     this.vendorData.map(item => {
    //       return {
    //           hlVendorName:item.hlVendorName,
    //           vendorLegalEntityName: item.vendorLegalEntityName,
    //           active: item.active,
    //           updatedBy: item.updatedBy,
    //           lastUpdatedDate: item.lastUpdatedDate
    //       }
    //   }).forEach(item => this.venDwnData.push(item));
    //   },
    //   error => {
    //   });
  }

  showSelectedData(vendorEntityId) {  
      console.log("radio button click" + vendorEntityId);
      this.editFlag = true;
      this.formMode="Modify";
      this.vendorInsertData = this.vendorData.filter(x => x.vendorEntityId == vendorEntityId)[0];
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
      // this.vendorInsertData.createdBy="503148032";
      // this.vendorInsertData.updatedBy="503148032";
      this.vendorService.saveOrUpdateVendor(this.vendorInsertData).subscribe(
        async refData => {
          this.saveMessage = refData;
          if(!this.saveMessage.Error == undefined)
            this.errorMessage = " Vendor Legal Entity: "+this.vendorInsertData.vendorLegalEntityName+"  already exist.";
          if(this.saveMessage.Error == false)
            this.errorMessage = " Vendor Legal Entity: "+this.vendorInsertData.vendorLegalEntityName+" was successfully saved.";
          else
            this.errorMessage =  " Entity cannot be saved due to error.";
          this.popupErrorMessage =  this.errorMessage;
          this.open(this.errorMessagePopUp);
          await this.getAllVendorDetails();
          this.cancel();
        },
        error => {
        });
    }else{
      //this.open(this.errorMessage);
    }
  }

  getAllHlVendorData() {
    return this.vendorService.getAllHlVendorData().toPromise().then(
      refData => {
        let arr: any = [];
        this.hlvendorReferenceData = refData;
        //this.hlVendorDataList.push({ label: "Select", value: "Select" })
        for (let data of this.hlvendorReferenceData) {
          let labelVendor = data.hlVendorName;
          this.hlVendorDataList.push({ label: labelVendor, value: data.hlvendorId })
        }
      }
    ).catch(console.log)
    // .subscribe(
    //   refData => {
    //     let arr: any = [];
    //     this.hlvendorReferenceData = refData;
    //     //this.hlVendorDataList.push({ label: "Select", value: "Select" })

    //     for (let data of this.hlvendorReferenceData) {
    //       let labelVendor = data.hlVendorName;
    //       this.hlVendorDataList.push({ label: labelVendor, value: data.hlvendorId })
    //     }
    //   },
    //   error => {
    //   });
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
