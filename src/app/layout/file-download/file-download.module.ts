import { NgModule,CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDownloadComponent } from './file-download.component';
 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule,NgbCarouselModule, NgbAlertModule,NgbDropdownModule,NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
 import { LayoutModule } from '../layout.module';
 import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {PickListModule} from 'primeng/picklist';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuItem} from 'primeng/api';
import {TabViewModule} from 'primeng/tabview';
 @NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbCarouselModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgbAlertModule.forRoot(),
    NgbModule.forRoot(),
    NgbDropdownModule.forRoot(),
   
    NgbModalModule.forRoot(),
    LayoutModule,
    PickListModule,
    TabMenuModule,
    TabViewModule,
   
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class FileDownloadModule { }
