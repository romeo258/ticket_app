import { CommonModule, Location } from '@angular/common';
import { Component, DestroyRef, inject, signal, ViewContainerRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AppStore } from '../../../store/app.store';
import { HotToastService } from '@ngxpert/hot-toast';
import { ModalService } from '../../../service/modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, EMPTY } from 'rxjs';
import { Settings } from '../../../enum/settings.enum';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  Settings = Settings;
  store = inject(AppStore);
  private location = inject(Location);
  private viewRef = inject(ViewContainerRef);
  private modalService = inject(ModalService);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(HotToastService)
  mode = signal<'view' | 'edit'>('view');

  constructor() { }

  ngOnInit(): void {
    if (!this.store.profile) {
      this.refresh();
    }
  }

  refresh = () => this.store.getProfile();

  goBack = () => this.location.back();

  updatePhoto = (file: File) => this.store.updatePhoto(file);

  toggleMfa = (mode: 'enable' | 'disable') => mode === 'enable' ? this.store.enableMfa() : this.store.disableMfa();

  updateRole = (event: any) => this.store.updateRole(event.target.value);

  // updateSettings = (event: any) => console.log(event);

  switchMode = () => this.mode() === 'view' ? this.mode.update(_mode => 'edit') : this.mode.update(_mode => 'view');

  updateUser = (form: NgForm) => {
    this.store.updateUser(form.value);
    this.mode.update(_mode => 'view');
  };

  updatePassword = (form: NgForm) => {
    console.log(form.value);
    this.store.updatePassword(form.value);
    form.reset();
  };

  toggleSettings = (settings: Settings) => {
    if(this.store.profile().role === 'ADMIN' || this.store.profile().role === 'SUPER_ADMIN') {
      switch (settings) {
        case Settings.EXPIRED:
          this.toggleAccountExpired();
          break;
        case Settings.LOCKED:
          this.toggleAccountLocked();
          break;
        case Settings.ENABLED:
          this.toggleAccountEnabled();
          break;
      }
    } else {
      this.toastService.error('You don\'t have permission to change account settings');
    }
  };

  private toggleAccountExpired = () => {
    this.modalService
      .open(this.viewRef, { message: `Are you sure you wanna change Account Expired?`, type: 'warning', subtitle: 'Updating account settings may change user access' })
      .pipe(switchMap(() => {
        this.store.toggleAccountExpired();
        return EMPTY;
      }), takeUntilDestroyed(this.destroyRef)).subscribe();
  };

  private toggleAccountLocked = () => {
    this.modalService
      .open(this.viewRef, { message: `Are you sure you wanna change Account Locked?`, type: 'warning', subtitle: 'Updating account settings may change user access' })
      .pipe(switchMap(() => {
        this.store.toggleAccountLocked();
        return EMPTY;
      }), takeUntilDestroyed(this.destroyRef)).subscribe();
  };

  private toggleAccountEnabled = () => {
    this.modalService
      .open(this.viewRef, { message: `Are you sure you wanna change Account Enabled?`, type: 'warning', subtitle: 'Updating account settings may change user access' })
      .pipe(switchMap(() => {
        this.store.toggleAccountEnabled();
        return EMPTY;
      }), takeUntilDestroyed(this.destroyRef)).subscribe();
  };

}
