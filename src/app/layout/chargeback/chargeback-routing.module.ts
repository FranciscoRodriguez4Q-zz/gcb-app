import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChargebackComponent } from './chargeback.component';

const routes: Routes = [
    {
        path: '', component: ChargebackComponent
    }];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChargebackRoutingModule
{

}