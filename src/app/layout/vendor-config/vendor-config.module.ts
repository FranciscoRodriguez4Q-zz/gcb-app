import { NgModule } from '@angular/core';
import { VendorConfigComponent } from './vendor-config.component';
import { FormsModule } from '@angular/forms';
import { PrimeModule } from 'src/app/prime';
import { VendorConfigRoutingModule } from './vendor-config-routing.mdoule';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../layout.module';

@NgModule({
declarations : [VendorConfigComponent],
imports : [
    CommonModule,
    FormsModule,
    PrimeModule,
    VendorConfigRoutingModule,
    LayoutModule
],
})
export class VendorConfigModule
{

}