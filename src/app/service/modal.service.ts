import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { ModalComponent } from '../component/navbar/modal/modal.component';

@Injectable()
export class ModalService {
private modalNotifier: Subject<Event>;
  private readonly destroyRef = inject(DestroyRef)
  document = inject(DOCUMENT);

  constructor() {}

  open = (viewRef: ViewContainerRef, options?: { message: string, subtitle?: string; title?: string, type?: 'success' | 'warning' | 'danger' }) => {
    const modalComponent = viewRef.createComponent(ModalComponent);
    modalComponent.instance.message = options.message;
    modalComponent.instance.type = options.type;
    modalComponent.instance.subtitle = options.subtitle;
    modalComponent.instance.closeEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.closeModal());
    modalComponent.instance.submitEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => this.submitModal(event));
    //modalComponent.hostView.detectChanges();
    //this.document.body.appendChild(modalComponent.location.nativeElement);
    this.modalNotifier = new Subject();
    return this.modalNotifier.asObservable();
  };

  closeModal = () => this.modalNotifier.complete(); 

  submitModal = (event: Event) => {
    this.modalNotifier.next(event);
    this.closeModal();
  };
}
