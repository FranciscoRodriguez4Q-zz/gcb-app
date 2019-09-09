import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerRoutingModule } from './buyer-routing.module';
import { BuyerComponent } from './buyer.component';
import { PrimeModule } from 'src/app/prime';
import {InputSwitchModule} from 'primeng/inputswitch';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layout.module';

@NgModule({
  declarations: [BuyerComponent],
  imports: [
    CommonModule,
    BuyerRoutingModule,
    PrimeModule,
    InputSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule
  ]
})
export class BuyerModule { }
