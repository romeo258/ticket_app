import { Component, HostListener, inject, signal, TemplateRef, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { formatFileSize, getFormData, logouturl } from '../../utils/fileutils';
import { FormsModule, NgForm } from '@angular/forms';
import { StorageService } from '../../service/storage.service';
import { UserService } from '../../service/user.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { DialogService } from '@ngneat/dialog';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../store/app.store';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  host: { '(document:click)': 'onClick($event)' },
})
export class NavbarComponent {

  filesToSave: File[] = [];
  isNavOpen = signal(false);
  isMenuOpen = signal(false);
  files: WritableSignal<{ name: string, size: string }[]> = signal([]);
  store = inject(AppStore);
  private storage = inject(StorageService);
  private userService = inject(UserService);
  private dialogService = inject(DialogService);
  private toastService = inject(HotToastService);

  constructor() {}

  ngOnInit() {
    this.store?.getProfile();
    this.store?.getMessages();
  }

  onFileChange = (files: FileList) => {
    const fileArray: { name: string, size: string }[] = [];
    Array.from(files).forEach(file => {
      fileArray.push({ name: file.name, size: formatFileSize(file.size) });
      this.filesToSave.push(file);
    });
    this.files.set(fileArray);
  };

  removeFile = (file: File) => {
    this.files.set([...this.files().filter(files => files.name !== file.name)]);
    this.filesToSave = [...this.filesToSave.filter(files => files.name !== file.name)];
  };

  saveTicket = (ticketForm: NgForm) => {
    const form = getFormData(ticketForm.value, this.filesToSave);
    this.store.saveTicket(form);
    ticketForm.reset();
    this.files.set([]);
    this.filesToSave = [];
    this.closeModal();
  };

  // @HostListener('document:click', ['$event'])
  onClick = (event: MouseEvent) => {
    console.log('Event fired', event);
    const target = <HTMLElement>event.target;
    const usermenu = target.closest('.usermenu');
    if (!usermenu) {
      this.isMenuOpen.set(false);
    }
    const navmenu = target.closest('.navmenu');
    if (!navmenu) {
      this.isNavOpen.set(false);
    }
  };


  openModal = (template: TemplateRef<HTMLDivElement>) => this.dialogService.open(template, {id: 'ticketModal'});

  closeModal = () => this.dialogService.closeAll();

  toggleMenu = () => this.isMenuOpen.update(isOpen => !isOpen);

  toggleNav = () => this.isNavOpen.update(isOpen => !isOpen);

  logOut = () => {
    this.userService.logOut();
    this.storage.removeRedirectUrl();
    this.toastService.success('You\'ve logged out successfully');
    window.location.href = logouturl;
  };
}
