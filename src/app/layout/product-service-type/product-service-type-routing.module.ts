import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductServiceTypeComponent } from './product-service-type.component';


const routes: Routes = [
  {
    path: '', component: ProductServiceTypeComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductServiceTypeRoutingModule { }
