import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationStrategy,HashLocationStrategy } from '@angular/common';
import { SampleFormComponent} from './layout/components/sample-form/sample-form.component';

const routes: Routes = [

  {
    path: 'layout', loadChildren: './layout/layout.module#LayoutModule' 
   },
   { path: 'sampleForm', component : SampleFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{provide:LocationStrategy, useClass: HashLocationStrategy}]

})
export class AppRoutingModule { }
