import { NgModule } from '@angular/core';
import { DropdownOnEnterDirective } from './dropdown-on-enter.directive';
import { NumberOnlyDirective } from './num-only.directive';
@NgModule({
  declarations: [
    DropdownOnEnterDirective,
    NumberOnlyDirective
  ],
  exports: [
    DropdownOnEnterDirective,
    NumberOnlyDirective
  ]
})
export class SharedDirectivesModule { }
