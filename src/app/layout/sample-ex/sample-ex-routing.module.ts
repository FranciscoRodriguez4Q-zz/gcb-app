import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SampleExComponent } from 'src/app/layout/sample-ex/sample-ex.component';

const routes: Routes = [
  {
    path: '', component: SampleExComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleExRoutingModule { }
