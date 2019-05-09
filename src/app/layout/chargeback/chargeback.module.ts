import { NgModule } from '@angular/core';
import { ChargebackComponent } from './chargeback.component';
import { FormsModule } from '@angular/forms';
import { ChargebackRoutingModule } from './chargeback-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
 declarations: [ChargebackComponent],
 imports : [FormsModule, CommonModule,ChargebackRoutingModule]
})
export class ChargebackModule
{

}