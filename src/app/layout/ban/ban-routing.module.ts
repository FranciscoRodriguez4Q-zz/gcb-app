import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BanComponent } from './ban.component';

const routes: Routes = [
  {
    path: '', component: BanComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BanRoutingModule { }
