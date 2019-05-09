import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorServiceCountryComponent } from './vendor-service-country.component';

const routes: Routes = [
  {
      path: '', component: VendorServiceCountryComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorServiceCountryRoutingModule { }