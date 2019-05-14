import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule,NgbCarouselModule, NgbAlertModule,NgbDropdownModule,NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from '../layout.module';
import {DropdownModule} from 'primeng/dropdown';
import {FileDownloadComponent} from '../file-download/file-download.component';
import { ServiceTypeComponent } from './service-type.component';
import { ServiceTypeRoutingModule } from './service-type-routing.module';
import { PrimeModule } from '../../prime';

@NgModule({
  declarations: [ServiceTypeComponent],
  imports: [ 
    CommonModule,FormsModule,
    ServiceTypeRoutingModule,
    CommonModule,
    FormsModule,PrimeModule  ,
    ReactiveFormsModule,
    NgbCarouselModule.forRoot(),
    NgbAlertModule.forRoot(),
    NgbModule.forRoot(),
    NgbDropdownModule.forRoot(),
    LayoutModule,
    NgbModalModule.forRoot(),
    DropdownModule
  ]
})
export class ServiceTypeModule { }
