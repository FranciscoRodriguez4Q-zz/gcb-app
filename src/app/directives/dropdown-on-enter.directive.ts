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
  private concat: string = "";

  constructor(public el: ElementRef, private model: NgModel){
    this.inputElement = el.nativeElement;
    this.onChange.subscribe(() => {
      this.concat = "";
    });
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
    }else {
      this.filteredOptions = this.options;
    }
    
  }
  
  @HostListener('keyup.enter')
  onKeyupEnter() {
    if(this.filteredOptions!=undefined){
      let i = 0;
      let isInFiltered:boolean=false;
      while (i<this.filteredOptions.length){
        if (this.filteredOptions[i].value == this.model.model){
          isInFiltered=true;
        }
        i++;
      }
      if(!isInFiltered){
        const { value } = this.filteredOptions[0];
        this.model.update.emit(value);
        this.concat = "";
        this.filteredOptions = [];
        this.onChange.emit(true);
      }
    }
  }
  
}

