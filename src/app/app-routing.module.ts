import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationStrategy,HashLocationStrategy } from '@angular/common';
import { SampleFormComponent} from './layout/components/sample-form/sample-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'layout', pathMatch: 'full' },
  {
    path: 'layout', loadChildren: './layout/layout.module#LayoutModule' 
   },
  { path: 'sampleForm', component: SampleFormComponent },
  { path: 'access-denied', loadChildren: './access-denied/access-denied.module#AccessDeniedModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{provide:LocationStrategy, useClass: HashLocationStrategy}]

})
export class AppRoutingModule { }
