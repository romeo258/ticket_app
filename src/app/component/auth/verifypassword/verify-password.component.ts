import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { switchMap, EMPTY, delay, Observer } from 'rxjs';
import { IResponse } from '../../../interface/response';
import { StorageService } from '../../../service/storage.service';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-verify-password',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './verify-password.component.html'
})
export class VerifypasswordComponent {
 state = signal<{ success?: boolean, token?: string, mode: 'verify' | 'reset', userUuid?: string, loading: boolean, message: string, error: string | any }>({ mode: 'verify', loading: false, message: undefined, error: undefined, success: false });
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);
    private storage = inject(StorageService);
    private userService = inject(UserService);
    private toastService = inject(HotToastService);
    private activatedRoute = inject(ActivatedRoute);

    constructor() { }

    ngOnInit(): void {
        this.activatedRoute.queryParamMap.pipe(
            switchMap((params: ParamMap) => {
                const token = params.get('token');
                if (token) {
                    this.state.set({ token, mode: 'verify', loading: true, message: undefined, error: undefined, success: false });
                    return this.userService.verifyPasswordToken$(token);
                } else {
                    this.state.set({ mode: 'verify', loading: false, message: undefined, error: 'Invalid link. Please try again', success: false });
                    return EMPTY;
                }
            }),
            delay(2 * 1000),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(this.verifySubscriber);
    }

    closeMessage = () => {
        this.state.update(state => ({ ...state, message: undefined, error: undefined }))
    };

    createNewPassword = (form: NgForm) => {
        this.userService.createNewPassword$(form.value)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update(state => ({ ...state, success: true, loading: false, message: response.message, error: undefined }));
                    this.toastService.success(response.message);
                    form.reset();
                },
                error: (error) => {
                    this.state.update(state => ({ ...state, loading: false, message: undefined, error, success: false }));
                    this.toastService.error(error)
                },
                complete: () => console.log('Observable complete')
            });
    };

    private verifySubscriber: Observer<any> = {
        next: (response: IResponse) => {
            this.state.update(state => ({ ...state, mode: 'reset', userUuid: response.data.user.userUuid, loading: false, message: `${response.message} for ${response.data.user.email}`, error: undefined }));
            this.toastService.success('Link has been verified');
        },
        error: (error) => {
            this.state.set({ mode: 'verify', loading: false, message: undefined, error });
            this.toastService.error(error)
        },
        complete: () => console.log('Observable complete')
    };

    private resetSubscriber: Observer<any> = {
        next: (response: IResponse) => {
            this.state.update(state => ({ ...state, loading: false, message: response.message, error: undefined }));
            this.toastService.success(response.message);
        },
        error: (error) => {
            this.state.update(state => ({ ...state, loading: false, message: undefined, error }));
            this.toastService.error(error)
        },
        complete: () => console.log('Observable complete')
    };
}
