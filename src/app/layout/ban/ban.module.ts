import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanRoutingModule } from './ban-routing.module';
import { BanComponent } from './ban.component';
import { PrimeModule } from 'src/app/prime';
import {InputSwitchModule} from 'primeng/inputswitch';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {PickListModule} from 'primeng/picklist';
import { LayoutModule } from '../layout.module';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { SharedDirectivesModule } from '../../directives/shared-directives.module';



@NgModule({
  declarations: [BanComponent, SiteDetailsComponent],
  imports: [
    CommonModule,
    BanRoutingModule,
    PrimeModule,
    InputSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    PickListModule,
    ProgressSpinnerModule,
    SharedDirectivesModule
  ]
})
export class BanModule { }
