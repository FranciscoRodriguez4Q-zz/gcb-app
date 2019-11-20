import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LocationStrategy,HashLocationStrategy } from '@angular/common';
const routes: Routes = [
  {
    path: '', component: LayoutComponent,
   children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      //{ path: 'VendorServiceCountry', loadChildren: './vendor-service-country/vendor-service-country.module#VendorServiceCountryModule'},
      { path: 'Chargeback', loadChildren: './chargeback/chargeback.module#ChargebackModule'},
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'home', loadChildren: './home/home.module#HomeModule' },
      { path: 'ServiceType', loadChildren: './service-type/service-type.module#ServiceTypeModule'},
      { path: '**', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: '', loadChildren: './dashboard/dashboard.module#DashboardModule' }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  

})
export class LayoutRoutingModule { }
