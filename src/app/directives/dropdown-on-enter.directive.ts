import { Input, ElementRef, HostListener, Directive, Output, EventEmitter } from '@angular/core';
import { NgModel } from '@angular/forms';
@Directive({
    selector: '[ngModel][onEnter]',
    providers: [NgModel],
})
export class DropdownOnEnterDirective {
    
  @Input() options;
  @Output() onChange = new EventEmitter<any>();
  
  private filteredOptions;
  public inputElement: HTMLElement;
  private index = 0;
  private concat: string = "";

  constructor(public el: ElementRef, private model: NgModel){
    this.inputElement = el.nativeElement;
    this.onChange.subscribe(() => {
      this.concat = "";
    })
  }
  
  @HostListener('input', ['$event'])
  onInput(event) {
    const { data, inputType } = event;
    if (inputType === 'insertText') {
      this.concat = `${this.concat}${data}`
    } else if (inputType === 'deleteContentBackward') {
      this.concat = this.concat.slice(0, this.concat.length - 1);
    }
    if (this.concat !== "") {
      this.filteredOptions = this.options.filter(({ label }) => {
        const _concat = this.concat.toLowerCase();
        const _label = label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return _label.includes(_concat);
      });
      this.index = 0;
      let i = 0;
      while (i<this.filteredOptions.length){
        if (this.filteredOptions[i].value == this.model.model){
          this.index = i;
          break;
        }
        i++;
      }
    }else {
      this.filteredOptions = [];
      this.index=0;
    }
    
  }
  
  @HostListener('keyup.enter')
  onKeyupEnter() {
    if (this.filteredOptions.length > 0 && this.concat != "") {
      const { value } = this.filteredOptions[this.index];
      this.model.update.emit(value);
      this.concat = "";
      this.filteredOptions = [];
      this.onChange.emit(true)
    }
  }

  @HostListener('keyup.arrowup')
  onKeyupArrowUp() {
    if (this.concat != "") {
      this.index --;
      if (this.index == -1)
        this.index = this.filteredOptions.length-1;
    }
  }

  @HostListener('keyup.arrowdown')
  onKeyupArrowDown() {
    if (this.concat != "") {
      this.index ++;
      if (this.filteredOptions.length == this.index)
        this.index = 0;
    }
  }
  
}

