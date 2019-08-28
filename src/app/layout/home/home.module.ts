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



@NgModule({
declarations :[ HomeComponent],
imports : [FormsModule, HomeRoutingModule,PrimeModule,TreeModule,TabViewModule,TabMenuModule ]
})
export class HomeModule
{}