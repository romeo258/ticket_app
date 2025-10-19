import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../../service/storage.service';
import { UserService } from '../../../service/user.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getFormData } from '../../../utils/fileutils';

@Component({
  selector: 'app-resetpassword',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './resetpassword.component.html'
})
export class ResetpasswordComponent {
  state = signal<{ loading: boolean, message: string, error: string | any }>({ loading: false, message: undefined, error: undefined });
  private storage = inject(StorageService);
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);
  private toastService = inject(HotToastService);
  private router = inject(Router);

  constructor() { }

  ngOnInit(): void {
    if (this.userService.isAuthenticated() && !this.userService.isTokenExpired()) {
      this.storage.getRedirectUrl() ? this.router.navigate([this.storage.getRedirectUrl()]) : this.router.navigate(['/dashboard']);
      return;
    }
  }

  closeMessage = () => this.state.set({ loading: false, message: undefined, error: undefined });

  resetPassword = (form: NgForm) => {
    this.state.set({ loading: true, message: undefined, error: undefined });
    this.userService.resetPassword$(getFormData(form.value, null)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: response => {
        this.state.set({ loading: false, message: response.message, error: undefined });
        this.toastService.success(response.message);
      },
      error: error => {
        this.state.set({ loading: false, message: undefined, error });
        this.toastService.error(error);
      },
      complete: () => form.reset()
    });
  };
}
