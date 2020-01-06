import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[doOnEnter]'
})
export class DoOnEnterDirective {

  @Output() doEnter = new EventEmitter<any>();

  constructor() { }

  @HostListener('keyup.enter')
  onKeyupEnter() {
    this.doEnter.emit();
  }

}
