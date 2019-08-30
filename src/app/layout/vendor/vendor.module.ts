import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorRoutingModule } from './vendor-routing.module';
import { VendorComponent } from './vendor.component';
import { PrimeModule } from 'src/app/prime';
import {InputSwitchModule} from 'primeng/inputswitch';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layout.module';

@NgModule({
  declarations: [VendorComponent],
  imports: [
    CommonModule,
    VendorRoutingModule,
    PrimeModule,
    InputSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule
  ]
})
export class VendorModule { }
