import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';

const routes : Routes =[
    {
        path: '', component: HomeComponent,
        children:[
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'Product', loadChildren: '../product/product.module#ProductModule'}
        ]
    }

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class HomeRoutingModule 
{}