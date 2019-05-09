import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { PrimeModule} from '../../prime';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {FileDownloadComponent} from '../file-download/file-download.component';
import { LayoutModule } from 'src/app/layout/layout.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,PrimeModule,DashboardRoutingModule
  ]
  ,
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
