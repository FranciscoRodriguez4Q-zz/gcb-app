import { Observable} from 'rxjs';
import { Inject,Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

//import { Angular5Csv } from 'angular5-csv/Angular5-csv';
 
@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor(private http: HttpClient) { }
  public tempData: any = [];
  public delimitArray: any = [];
  public csvData: any = [];
  public csvArry: any = [];

  static toExportFileName(excelFileName: string): string {
    return `${excelFileName}.xlsx`;
  }

  public exportAsExcelFile(json: any[], excelFileName: string,fileNameCheck:string,colsHeader: any[]): void {
    const workbook: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };
    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    if(fileNameCheck==="VSC" || fileNameCheck==="CB" || fileNameCheck==="ServiceType" || fileNameCheck==="Vendor"
    || fileNameCheck==="Buyer" || fileNameCheck==="Ban" || fileNameCheck==="VendorConfig" || fileNameCheck==="Product")
    { //Custom Headers for ESB download Report
      XLSX.utils.sheet_add_json(worksheet, [], { header:colsHeader} ); 
    }
    const ws_name = excelFileName;
    XLSX.utils.book_append_sheet(workbook, worksheet, ws_name);
   
    XLSX.writeFile(workbook, FileDownloadService.toExportFileName(excelFileName));
  }

  public exportAsExcelFileForChart(json: any[], excelFileName: string): void {
    const workbook: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    XLSX.utils.book_append_sheet(workbook, worksheet);
    XLSX.writeFile(workbook, excelFileName + ".xlsx");
  }

  public procesTextFile(delimt: string, dwnData: any, fileName: string,fileNameCheck:string,colsHeader: any[]) {
    this.delimitArray = dwnData;
    this.tempData = [];
    var i = 0; var j = 0;
    if(fileNameCheck==="VSC" || fileNameCheck==="CB" || fileNameCheck==="Vendor" || fileNameCheck==="Buyer" || fileNameCheck==="Ban" || fileNameCheck==="VendorConfig"
    || fileNameCheck==="ServiceType" || fileNameCheck==="Product")
    { //Custom Headers for ServiceType download Report
      let colNm = [];
      for (i = 0; i < colsHeader.length; i++) {
        colNm[colsHeader[i]] = "";
      }
      this.tempData[0]  = colNm;
    }
    for (i = 0; i < this.delimitArray.length; i++) {
      if (this.delimitArray[i] != null) {
        this.tempData.push(this.delimitArray[i]);
      }
    }
    

    
    var txtData = new Blob([this.ConvertToFile(this.tempData, delimt)], { type: 'text/plain;charset=utf-8;'  });
    
    var txtURL = null;
    if (navigator.msSaveBlob) {
      txtURL = navigator.msSaveBlob(txtData, fileName + '.txt');
    } else {
      txtURL = window.URL.createObjectURL(txtData);
    }
    var tempLink = document.createElement('a');
    tempLink.href = txtURL;
    tempLink.setAttribute('download', fileName + '.txt');
    tempLink.click();

  }

  public ConvertToFile(objArray: any, delimit: string): string {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";

    for (var index in objArray[0]) {
      //Now convert each value to string and delimiter-separated
      row += index + delimit;
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += delimit

        line += array[i][index];
      }
      if (line != '')
      str += line + '\r\n';
    }
    return str;
  }

  processCSVFile(dwnData: any, fileName: string,fileNameCheck:string,colsHeader: any[]) {
    var header = [];
    this.csvArry = dwnData;
    var i = 0; var j = 0;
    for (i = 0; i < this.csvArry.length; i++) {
      if (this.csvArry[i] != null) {
        this.tempData.push(this.csvArry[i]);
        if (header.length == 0)
          header = Object.getOwnPropertyNames(this.csvArry[i]);
      }
    }
   // new Angular5Csv(this.tempData, fileName, { headers: (header) });
   const replacer = (key, value) => value === null ? '' : value;
   let csv = dwnData.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
   if(fileNameCheck==="VSC" || fileNameCheck==="CB" || fileNameCheck==="Vendor" || fileNameCheck==="Buyer" || fileNameCheck==="Ban" || fileNameCheck==="VendorConfig"
   || fileNameCheck==="ServiceType" || fileNameCheck==="Product")
   { //Custom Headers for ESB download Report
    csv.unshift(colsHeader.join(','));
    }else{
    csv.unshift(header.join(','));
    }
    let csvArray = csv.join('\r\n');

    var a = document.createElement('a');
    var blob = new Blob([csvArray], {type: 'text/csv' }),
    url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = fileName +".csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  public getVSCountryDWData(colsHeader): Observable<Object> {
    return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/getVSCountryDWData", '');

  }
  public getCBData(colsHeader): Observable<Object> {
    return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/getCBData", '');
  }
  public getServiceTypeData(colsHeader): Observable<Object> {
    return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/dwnServiceTypesData", '');
  }

  public getVendorData(colsHeader): Observable<Object> {
    return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/vendor/dwnVendorData",'');
  }

  public getBuyerData(colsHeader): Observable<Object> {
    return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/buyer/dwnBuyerData",'');
  }

  public getVendorConfigData(colsHeader): Observable<Object> {
    return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/dwnVendorConfig",'');
  }

  public getBanData(colsHeader): Observable<Object> {
    return this.http.post(environment.APP_BASE_URL_SERVICE_ENDPOINT + "/ban/dwnBanData",'');
  }
  
}
