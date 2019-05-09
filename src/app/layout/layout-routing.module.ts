import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LocationStrategy,HashLocationStrategy } from '@angular/common';
const routes: Routes = [
  {
    path: '', component: LayoutComponent,
   children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'sampleEx', loadChildren: './sample-ex/sample-ex.module#SampleExModule'   },
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
