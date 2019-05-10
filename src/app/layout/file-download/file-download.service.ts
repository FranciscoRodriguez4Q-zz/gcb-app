import { Inject,Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
//import { Angular5Csv } from 'angular5-csv/Angular5-csv';
 
@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor() { }
  public tempData: any = [];
  public delimitArray: any = [];
  public csvData: any = [];
  public csvArry: any = [];

  static toExportFileName(excelFileName: string): string {
    return `${excelFileName}.xlsx`;
  }

  public exportAsExcelFile(json: any[], excelFileName: string,fileNameCheck:string): void {
    const workbook: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };
    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
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

  public procesTextFile(delimt: string, dwnData: any, fileName: string,fileNameCheck:string) {
    this.delimitArray = dwnData;
    var i = 0; var j = 0;

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

  processCSVFile(dwnData: any, fileName: string,fileNameCheck:string) {
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
  }

}
