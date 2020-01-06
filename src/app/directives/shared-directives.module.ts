import { NgModule } from '@angular/core';
import { DropdownOnEnterDirective } from './dropdown-on-enter.directive';
import { NumberOnlyDirective } from './num-only.directive';
import { DoOnEnterDirective } from './do-on-enter.directive';
@NgModule({
  declarations: [
    DropdownOnEnterDirective,
    NumberOnlyDirective,
    DoOnEnterDirective
  ],
  exports: [
    DropdownOnEnterDirective,
    NumberOnlyDirective,
    DoOnEnterDirective
  ]
})
export class SharedDirectivesModule { }
