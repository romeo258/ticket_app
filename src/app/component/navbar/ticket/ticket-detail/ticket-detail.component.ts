import { Component, DestroyRef, inject, Input, signal, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '@ngneat/dialog';
import { AppStore } from '../../../../store/app.store';
import { ModalService } from '../../../../service/modal.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { getFormData } from '../../../../utils/fileutils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, EMPTY } from 'rxjs';

@Component({
  selector: 'app-ticket-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-detail.component.html'
})
export class TicketDetailComponent {
  @Input() ticketUuid = ''
  readonly mode = signal<'view' | 'edit'>('view');
  readonly commentMode = signal<{ mode: 'view' | 'edit', commentUuid: string }>({ mode: 'view', commentUuid: null });
  readonly store = inject(AppStore);
  private destroyRef = inject(DestroyRef);
  private viewRef = inject(ViewContainerRef);
  private modalService = inject(ModalService);
  private readonly location = inject(Location);
  private dialogService = inject(DialogService);
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor(){}

  ngOnInit(): void {
    if (this.ticketUuid) { 
      this.store?.getTicket(this.ticketUuid); 
    }
  }

  goBack = () => this.location.back();

  openModal = (template: TemplateRef<HTMLDivElement>) => this.dialogService.open(template, { id: new Date().getTime().toString()});

  closeModal = () => this.dialogService.closeAll();

  switchMode = () => this.mode() === 'view' ? this.mode.update(_mode => 'edit') : this.mode.update(_mode => 'view');

  toggleCommentMode = (mode: 'edit' | 'view', commentUuid: string) => this.commentMode.set({ mode, commentUuid });

  updateTicket = (ticketForm: NgForm) => {
    this.mode.update(_ => 'view');
    this.store.updateTicket({ ...ticketForm.value, dueDate: ticketForm.value.dueDate.split('T')[0] });
  };

  addComment = (commentForm: NgForm) => {
    this.store.addComment(getFormData(commentForm.value, null));
    commentForm.reset({ comment: '', ticketUuid: this.store.ticketDetail()?.ticket.ticketUuid });
  };

  updateComment = (commentUuid: string, comment: string) => {
    if (comment.trim().length > 0) {
      this.commentMode.set({ mode: 'view', commentUuid: null });
      this.store.updateComment(getFormData({ commentUuid, comment }, null));
    }
  };

  deleteComment = (commentUuid: string) => {
    this.modalService
      .open(this.viewRef, { message: `Are you sure you wanna delete this comment?`, type: 'danger', subtitle: ' This action is not reversible, so please continue with caution.' })
      .pipe(takeUntilDestroyed(this.destroyRef),
        switchMap(() => {
          this.store.deleteComment(getFormData({ commentUuid }, null));
          return EMPTY;
        })).subscribe();
  };

  uploadFiles = (files: FileList) => this.store.uploadFiles(getFormData({ ticketUuid: this.store.ticketDetail()?.ticket.ticketUuid }, Array.from(files)));

  downloadFile = (fileUuid: string) => this.store.downloadFile(fileUuid);

  deleteFile = (fileUuid: string, filename: string) => {
    this.modalService
      .open(this.viewRef, { message: `Are you sure you wanna delete file "${filename}"?`, type: 'danger', subtitle: ' This action is not reversible, so please continue with caution.' })
      .pipe(takeUntilDestroyed(this.destroyRef),
        switchMap(() => {
          this.store.deleteFile(getFormData({ fileUuid }, null));
          return EMPTY;
        })).subscribe();
  };

  updateAssignee = (ticketUuid: string, userUuid: string) => this.store.updateAssignee(getFormData({ ticketUuid, userUuid }, null));

  createTask = (taskForm: NgForm) => {
    this.store.createTask(getFormData(taskForm.value, null));
    taskForm.reset();
    this.closeModal();
  };
}
