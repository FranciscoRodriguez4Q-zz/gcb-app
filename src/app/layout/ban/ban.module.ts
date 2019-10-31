import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanRoutingModule } from './ban-routing.module';
import { BanComponent } from './ban.component';
import { PrimeModule } from 'src/app/prime';
import {InputSwitchModule} from 'primeng/inputswitch';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {PickListModule} from 'primeng/picklist';
import { NumberOnlyDirective } from '../../directives/num-only.directive';
import { LayoutModule } from '../layout.module';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { SiteDetailsComponent } from './site-details/site-details.component';



@NgModule({
  declarations: [BanComponent, NumberOnlyDirective, SiteDetailsComponent],
  imports: [
    CommonModule,
    BanRoutingModule,
    PrimeModule,
    InputSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    PickListModule,
    ProgressSpinnerModule
  ]
})
export class BanModule { }
