import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { PrimeModule } from 'src/app/prime';
import { HomeRoutingModule } from './home-routing.module';
import { TreeModule } from 'primeng/primeng';
import { HomeService } from './home.service';
import { HttpClientModule } from '@angular/common/http';
import {TabViewModule} from 'primeng/tabview';
import {TabMenuModule} from 'primeng/tabmenu';
import { SpinnerComponent } from '../../shared/modules/spinner/spinner.component';
import { CommonModule } from '@angular/common';



@NgModule({
declarations :[ HomeComponent,SpinnerComponent],
imports : [FormsModule, HomeRoutingModule,PrimeModule,TreeModule,TabViewModule,TabMenuModule,CommonModule ]
})
export class HomeModule
{}