
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { MessageModule } from "primeng/message";
import { FileDownloadComponent } from '../file-download/file-download.component';
import { LayoutModule } from '../layout.module';
import { PrimeModule } from 'src/app/prime';
import { NgbModule, NgbDropdownModule, NgbModalModule, NgbAlertModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import {FieldsetModule} from 'primeng/fieldset';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { SharedDirectivesModule } from '../../directives/shared-directives.module';

@NgModule({
  declarations: [ProductComponent],
  imports: [      
    CommonModule,
    FormsModule,
    SharedDirectivesModule,
    ProductRoutingModule,
    LayoutModule,
    
    ButtonModule,DropdownModule,TableModule,CheckboxModule,RadioButtonModule,MessagesModule,MessageModule,ToastModule,
    PrimeModule  ,
    ReactiveFormsModule,
    FieldsetModule,
    
    NgbCarouselModule.forRoot(),
    NgbAlertModule.forRoot(),
    NgbModule.forRoot(),
    NgbDropdownModule.forRoot(),
    NgbModalModule.forRoot(),
  ]
})
export class ProductModule { }
