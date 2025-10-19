import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, ElementRef, inject, Input, Renderer2, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Emails } from '../../../../pipe/emails.pipe';
import { AppStore } from '../../../../store/app.store';
import { getFormData } from '../../../../utils/fileutils';

@Component({
  selector: 'app-message-detail',
  imports: [CommonModule, FormsModule, Emails],
  templateUrl: './message-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageDetailComponent {
  @ViewChild('message') message: ElementRef<HTMLDivElement>;
  @Input() conversationId: string = undefined
  store = inject(AppStore);
  private location = inject(Location);
  private renderer = inject(Renderer2);
  private changeDetector = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.store?.conversation();
      this.scrollChatWindown();
      this.changeDetector.markForCheck();
    });
  }

  ngOnInit() {
    if(this.conversationId) {
      this.store?.getConversation(this.conversationId);
    }
  }

  ngAfterViewChecked() {
    this.scrollChatWindown();
  }

  goBack = () => this.location.back();

  saveMessage = (form: NgForm) => {
    this.store.replyToMessage(getFormData(form.value, null));
    form.reset({ toEmail: form.value.toEmail });
  };

  private scrollChatWindown = () => {
    if(this.message && this.message?.nativeElement && this.message?.nativeElement.scrollHeight > this.message.nativeElement.scrollTop){
      this.renderer.setProperty(this.message.nativeElement, 'scrollTop', this.message.nativeElement.scrollHeight);
    }
  };
}
