import { NgModule } from '@angular/core';
import { ChargebackComponent } from './chargeback.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ChargebackRoutingModule } from './chargeback-routing.module';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../layout.module';
import { PrimeModule } from 'src/app/prime';
import {InputSwitchModule} from 'primeng/inputswitch';



@NgModule({
 declarations: [ChargebackComponent],
 imports : [FormsModule, CommonModule,ChargebackRoutingModule,
         LayoutModule,ReactiveFormsModule,PrimeModule,InputSwitchModule]
})
export class ChargebackModule
{

}