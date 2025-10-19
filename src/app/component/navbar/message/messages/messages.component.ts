import { Component, inject, TemplateRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DialogService } from '@ngneat/dialog';
import { AppStore } from '../../../../store/app.store';
import { getFormData } from '../../../../utils/fileutils';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MessageGroup } from '../../../../pipe/message.pipe';

@Component({
  selector: 'app-messages',
  imports: [CommonModule, FormsModule, RouterLink, MessageGroup],
  templateUrl: './messages.component.html'
})
export class MessagesComponent {
  private readonly location = inject(Location);
  private dialogService = inject(DialogService);
  readonly store = inject(AppStore);

  constructor() {}

  ngOnInit(): void {
    this.store?.getMessages();
  }

  openModal = (template: TemplateRef<HTMLDivElement>) => this.dialogService.open(template, {id: 'messageModal'});

  closeModal = () => this.dialogService.closeAll();

  saveMessage = (messageForm: NgForm) => {
    this.store.sendMessage(getFormData(messageForm.value, null));
    this.closeModal();
  };
}
