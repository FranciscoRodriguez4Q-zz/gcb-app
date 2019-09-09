import { Component, OnInit, ViewChild } from '@angular/core';
import { BuyerService } from './buyer.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-product',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss']
})
export class BuyerComponent implements OnInit {

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
    "lastUpdatedDate":"lastUpdatedDate",
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
  
  constructor(private buyerService: BuyerService,private modalService: NgbModal) { }
  

  public cols = [
    { field: 'erpBuyerLeName', header: 'ERP Buyer Name', width: '20%' },
    { field: 'erpOuEntityName', header: 'OU Name', width: '5%' },
    { field: 'erpOuNumber', header: 'OU Number', width: '10%' },
    { field: 'locationName', header: 'Buyer Location', width: '20%' },
    { field: 'goldId', header: 'Gold ID', width: '10%' },
    { field: 'updatedBy', header: 'Updated By', width: '10%' },
    { field: 'lastUpdatedDate', header: 'Updated Date', width: '10%' },
  ];

  public buyerInsertData: any = {
    "erpBuyerLeName": "",
    "erpOuNumber": "",
    "erpOuEntityName":"",
    "buyerLocationId":"",
    "goldId": "",
    "updatedBy": "",
    "buyerInfo":"",
    "goldNetName":""
  };

  ngOnInit() {
    this.getAllBuyerDetails();
    for (let i = 0; i < this.cols.length; i++) {
      // console.log("in Download method"+i);
      this.downloadCols.push(this.cols[i].header);
    }    
    this.getAllCountryData();
  }

  getAllBuyerDetails() {
    this.buyerService.getBuyerDetails().subscribe(
      refData => {
        this.buyerData=refData;
        this.gridLoadFlag = true;

        this.buyerData.map(item => {
          return {
              erpBuyerLeName: item.erpBuyerLeName,
              erpOuEntityName: item.erpOuEntityName,
              erpOuNumber: item.erpOuNumber,
              locationName: item.locationName,
              goldId:this.goldId,
              updatedBy:this.updatedBy,
              lastUpdatedDate:this.lastUpdatedDate,
          }
      }).forEach(item => this.buyerDwnData.push(item));
      },
      error => {
      });
  }

  getAllCountryData(){
    this.buyerService.getAllCountryCode().subscribe(
      refData => {
        let arr: any = [];
        this.countryCodeReferenceData = refData;
        this.countryCodeReferenceDataList.push({ label: "Select", value: "Select" })
  
        for (let data of this.countryCodeReferenceData) {
          let labelCountry = data.countryCode + " | " + data.countryName;
          this.countryCodeReferenceDataList.push({ label: labelCountry, value: data.countryId })
        }
      },
      error => {
      });
  }

  showSelectedData(buyerId) {
    console.log("radio button click" + this.buyerId);
    this.editFlag = true;
    this.formMode="Modify";
    this.buyerInsertData = this.buyerData.filter(x => x.buyerId == buyerId)[0];
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  clearAllFilters(){
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
  }

  validation(){
    if(this.buyerInsertData.erpBuyerLeName==""){
      this.errorMessage = "Please Enter Buyer ERP Le Name";
      return false;
    }
    if(this.buyerInsertData.erpOuEntityName==""){
      this.errorMessage = "Please Enter ERP OU Entity Name";
      return false;
    }
    if(this.buyerInsertData.erpOuNumber==""){
      this.errorMessage = "Please Enter ERP OU Number";
      return false;
    }
    if(this.buyerInsertData.buyerInfo==""){
      this.errorMessage = "Please Enter Buyer info";
      return false;
    }
    if(this.buyerInsertData.buyerLocationId=="Select" || this.buyerInsertData.buyerLocationId==""){
      this.errorMessage = "Please Enter Buyer Location";
      return false;
    }
    if(this.buyerInsertData.goldId==""){
      this.errorMessage = "Please Enter Gold ID";
      return false;
    }
    else{
      return true;
    }
  }

  upsertBuyer() {
    this.errorMessage = "";
    //this.msgs = [];
    console.log("test button click");
    if (this.validation()) {
      this.buyerInsertData.createdBy="503148032";
      this.buyerInsertData.updatedBy="503148032";
      this.buyerService.upsertBuyer(this.buyerInsertData).subscribe(
        refData => {
          this.saveMessage = refData;
          if(!this.saveMessage.Error == undefined)
            this.errorMessagePopUp = "Buyer Already Exits";
          if(this.saveMessage.Error == false)
            this.errorMessagePopUp = "Buyer Name "+this.buyerInsertData.erpBuyerLeName+" Save Suceesfully.";
          else
            this.errorMessagePopUp =  "buyer Name "+this.buyerInsertData.erpBuyerLeName+" not Saved..";
          this.open(this.errorMessagePopUp);
          this.getAllBuyerDetails();
          this.clearAllFilters();
        },
        error => {
        });
    }else{
      //this.open(this.errorMessage);
    }
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
}
