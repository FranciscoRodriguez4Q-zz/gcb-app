import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule,NgbCarouselModule, NgbAlertModule,NgbDropdownModule,NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductServiceTypeComponent } from './product-service-type.component';
import { ProductServiceTypeRoutingModule } from './product-service-type-routing.module';
import { PrimeModule } from '../../prime';
import { DropdownModule } from 'primeng/dropdown';
import {FileDownloadComponent} from '../file-download/file-download.component';
import { LayoutModule } from '../layout.module';
import {FieldsetModule} from 'primeng/fieldset';

@NgModule({
  declarations: [ProductServiceTypeComponent],
  imports: [ 
    CommonModule,
    ProductServiceTypeRoutingModule,
    NgbModalModule.forRoot(),
    DropdownModule,
    FormsModule,PrimeModule  ,
    ReactiveFormsModule,
    NgbCarouselModule.forRoot(),
    NgbAlertModule.forRoot(),
    NgbModule.forRoot(),
    NgbDropdownModule.forRoot(),
    LayoutModule

  ]
})
export class ProductServiceTypeModule { }
