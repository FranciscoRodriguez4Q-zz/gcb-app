import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
//import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { AppConstants } from '../../shared/constants/app.constants';
import * as XLSX from 'xlsx';
import { FileDownloadService } from './file-download.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-file-download',
  templateUrl: './file-download.component.html',
  styleUrls: ['./file-download.component.scss'],
  providers: [FileDownloadService, DatePipe]

})
export class FileDownloadComponent implements OnInit {
  public downloadOptions: any = [];
  public defaultOption: any = "CSV";
  public countArry: any = [];
  public totalCount: number = 0;
  public myDate = new Date();
  public tempData: any = [];
  public delimitArray: any = [];
  public fileNameCheck: any;
  public nameCheck: any;

  @Input() dwnData: any;
  @Input() colsHeader: any;
  @Input() fileName: any;
  @Input() fileFormat: any;
  @Output() dwnAction: EventEmitter<any> = new EventEmitter();
  constructor(private fileDownloadService: FileDownloadService, private datePipe: DatePipe) {
 }

  ngOnInit() {
  /*   this.countArry = this.dwnData;
    this.totalCount = this.countArry.length; */
    this.downloadOptions = ['CSV', 'Excel', 'Tilde SV', 'Pipe SV'];
    this.fileFormat = 'CSV';
    let date = this.datePipe.transform(this.myDate, 'yyyyMMdd_HHmm');
    this.fileNameCheck = this.fileName.split("_",2);
    this.nameCheck=this.fileNameCheck[0];
    this.fileName = this.fileName + "_" + date;
  }

  onOptionSelect(selectedItem: string) {
    this.defaultOption = selectedItem;
  }

  downloadReport() {
    
    if(this.nameCheck=='ServiceType'){
      for (let i = 0; i < this.dwnData.length; i++) {
        delete this.dwnData[i].productId;
        delete this.dwnData[i].serviceTypeId;
        delete this.dwnData[i].countryCode;
        delete this.dwnData[i].suggestedServiceType;
        delete this.dwnData[i].serviceTypeMessage;
        delete this.dwnData[i].useSuggested;
      }
      this.dwnAction.emit("download");
    }
    switch (this.defaultOption) {
      case AppConstants.CASE_DOWNLOAD_CSV:
        this.processCSVFile();
        break;
      case AppConstants.CASE_DOWNLOAD_EXCEL:
        this.processExcelFile();
        break;
      case AppConstants.CASE_DOWNLOAD_TILDE:
        this.procesTextFile('~');
        break;
      case AppConstants.CASE_DOWNLOAD_PIPE:
        this.procesTextFile('|');
        break;
      default:
        break;
    }
  }

  processExcelFile() {
    this.fileDownloadService.exportAsExcelFile(this.dwnData, this.fileName,this.nameCheck,this.colsHeader);
  }

  procesTextFile(delimt: string) {
    this.fileDownloadService.procesTextFile(delimt, this.dwnData, this.fileName,this.nameCheck,this.colsHeader);
  }

  processCSVFile() {
    this.fileDownloadService.processCSVFile(this.dwnData, this.fileName,this.nameCheck,this.colsHeader);
  }

}
