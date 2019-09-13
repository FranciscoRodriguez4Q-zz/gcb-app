import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';

const routes : Routes =[
    {
        path: '', component: HomeComponent,
        children:[
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'Product', loadChildren: '../product/product.module#ProductModule'},
            { path: 'ProductServiceType', loadChildren: '../product-service-type/product-service-type.module#ProductServiceTypeModule'},
            { path: 'Vendor', loadChildren: '../vendor/vendor.module#VendorModule'},
            { path: 'VendorConfig', loadChildren: '../vendor-config/vendor-config.module#VendorConfigModule'},
            { path: 'Buyer', loadChildren: '../buyer/buyer.module#BuyerModule'},
            { path: 'Ban', loadChildren: '../ban/ban.module#BanModule'}
        ]
    }

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class HomeRoutingModule 
{}