import { CommonModule, Location } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppStore } from '../../../store/app.store';
import { getValue } from '../../../utils/fileutils';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule, RouterLink],
  standalone: true,
  templateUrl: './reports.component.html'
})
export class ReportsComponent {
  readonly store = inject(AppStore);
  private readonly location = inject(Location);
  isStatusMenuOpen = signal<boolean>(false);
  isTypeMenuOpen = signal<boolean>(false);
  isPriorityMenuOpen = signal<boolean>(false);
  Menu = Menu;
  request: {};

  constructor() {}

  goBack = () => this.location.back();

  toggleMenu = (menu: Menu) => {
    switch (menu) {
      case Menu.STATUS: {
        this.isStatusMenuOpen.update(open => !open);
        this.isTypeMenuOpen.set(false);
        this.isPriorityMenuOpen.set(false);
        break;
      }
      case Menu.TYPE: {
        this.isTypeMenuOpen.update(open => !open);
        this.isStatusMenuOpen.set(false);
        this.isPriorityMenuOpen.set(false);
        break;
      }
      case Menu.PRIORITY: {
        this.isPriorityMenuOpen.update(open => !open);
        this.isStatusMenuOpen.set(false);
        this.isTypeMenuOpen.set(false);
        break;
      }
      default: {
        this.isStatusMenuOpen.set(false);
        this.isTypeMenuOpen.set(false);
        this.isPriorityMenuOpen.set(false);
      }
    }
  };

  closeMenu = () => {
    this.isStatusMenuOpen.set(false);
    this.isTypeMenuOpen.set(false);
    this.isPriorityMenuOpen.set(false);
  };

  @HostListener('document:click', ['$event'])
  onClick = (event: MouseEvent) => {
    const target = <HTMLElement>event.target;
    const status = target.closest('.status');
    const type = target.closest('.type');
    const priority = target.closest('.priority');
    if(!status) {
      this.isStatusMenuOpen.set(false);
    }
    if(!type) {
      this.isTypeMenuOpen.set(false);
    }
    if(!priority) {
      this.isPriorityMenuOpen.set(false);
    }
  };

  report = (form: NgForm) => {
    this.closeMenu();
    this.request = getValue(form.value);
    this.store.setReportRequest(this.request);
    this.store.getReport(this.request);
  };

  downloadPDF = () => {
    this.closeMenu();
    const request = this.store.reportRequest();
    this.store.downloadReport(request);
  };
}

enum Menu { STATUS = 'STATUS', TYPE = 'TYPE', PRIORITY = 'PRIORITY' };
