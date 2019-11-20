import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorRoutingModule } from './vendor-routing.module';
import { VendorComponent } from './vendor.component';
import { PrimeModule } from 'src/app/prime';
import {InputSwitchModule} from 'primeng/inputswitch';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layout.module';
import { SharedDirectivesModule } from '../../directives/shared-directives.module';

@NgModule({
  declarations: [VendorComponent],
  imports: [
    CommonModule,
    VendorRoutingModule,
    PrimeModule,
    SharedDirectivesModule,
    InputSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule
  ]
})
export class VendorModule { }
