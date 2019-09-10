import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanRoutingModule } from './ban-routing.module';
import { BanComponent } from './ban.component';
import { PrimeModule } from 'src/app/prime';
import {InputSwitchModule} from 'primeng/inputswitch';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layout.module';

@NgModule({
  declarations: [BanComponent],
  imports: [
    CommonModule,
    BanRoutingModule,
    PrimeModule,
    InputSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule
  ]
})
export class BanModule { }
