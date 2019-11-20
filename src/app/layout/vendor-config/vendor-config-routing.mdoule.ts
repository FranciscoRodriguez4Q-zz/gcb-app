import { NgModule } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorConfigComponent } from './vendor-config.component';

const routes: Routes = [
    { 
      path: '', component: VendorConfigComponent
  
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VendorConfigRoutingModule 
{

}