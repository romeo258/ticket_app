import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { delay, EMPTY, Observer, switchMap } from 'rxjs';
import { IResponse } from '../../../interface/response';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-verifyaccount',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './verifyaccount.component.html'
})
export class VerifyaccountComponent {
  state = signal<{ loading: boolean, message: string, error: string | any }>({ loading: true, message: undefined, error: undefined });
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);
  private toastService = inject(HotToastService);
  private activatedRoute = inject(ActivatedRoute);

  constructor() { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.pipe(
      switchMap((params: ParamMap) => {
        const token = params.get('token');
        if (token) {
          this.state.set({ loading: true, message: undefined, error: undefined });
          return this.userService.verifyAccountToken$(token);
        } else {
          this.state.set({ loading: false, message: undefined, error: 'Invalid link. Please try again' });
          return EMPTY;
        }
      }),
      delay(2 * 1000),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(this.verifyAccount);
  }

  closeMessage = () => {
    this.state.update(state => ({ ...state, message: undefined, error: undefined }))
  };

  private verifyAccount: Observer<any> = {
    next: (response: IResponse) => {
      this.state.set({ loading: false, message: response.message, error: undefined });
      this.toastService.success('Account has been verified');
    },
    error: (error) => {
      this.state.set({ loading: false, message: undefined, error });
      this.toastService.error(error);
    },
    complete: () => console.log('Observable complete')
  };
}
