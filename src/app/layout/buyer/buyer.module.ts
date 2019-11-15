import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerRoutingModule } from './buyer-routing.module';
import { BuyerComponent } from './buyer.component';
import { PrimeModule } from 'src/app/prime';
import {InputSwitchModule} from 'primeng/inputswitch';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layout.module';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { SharedDirectivesModule } from '../../directives/shared-directives.module';


@NgModule({
  declarations: [BuyerComponent],
  imports: [
    SharedDirectivesModule,
    CommonModule,
    BuyerRoutingModule,
    PrimeModule,
    InputSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    ProgressSpinnerModule
  ]
})
export class BuyerModule { }
