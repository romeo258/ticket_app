import { NgClass } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [NgClass],
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  private elementRef = inject(ElementRef);
  @Input() message: string;
  @Input() subtitle: string;
  @Input() type: 'success' | 'warning' | 'danger';
  @Output() closeEvent = new EventEmitter<Event>();
  @Output() submitEvent = new EventEmitter<Event>();

  constructor() {}

  close = () => {
    this.elementRef.nativeElement.remove();
    this.closeEvent.emit();
  };

  submit = (event: Event) => {
    this.elementRef.nativeElement.remove();
    this.submitEvent.emit(event);
  };
}
