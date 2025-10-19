import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { switchMap, EMPTY, delay, Observer } from 'rxjs';
import { Key } from '../../../enum/cache.key';
import { IAuthentication } from '../../../interface/authentication';
import { StorageService } from '../../../service/storage.service';
import { UserService } from '../../../service/user.service';
import { getFormData } from '../../../utils/fileutils';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  loading = signal<boolean>(true);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private storage = inject(StorageService);
  private userService = inject(UserService);
  private toastService = inject(HotToastService);
  private activatedRoute = inject(ActivatedRoute);

  constructor() { }

  ngOnInit(): void {
    if (this.userService.isAuthenticated() && !this.userService.isTokenExpired()) {
      this.storage.getRedirectUrl() ? this.router.navigate([this.storage.getRedirectUrl()]) : this.router.navigate(['/dashboard']);
      return;
    } else {
      this.activatedRoute.queryParamMap.pipe(
        switchMap((params: ParamMap) => {
          const code = params.get('code');
          if (code) {
            this.loading.set(true);
            return this.userService.validateCode$(this.formData(code));
          } else {
            this.loading.set(false);
          }
          return EMPTY;
        }),
        delay(2 * 1000),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(this.subscriber);
    }
  }

  private subscriber: Observer<IAuthentication> = {
    next: (data) => {
      this.saveToken(data);
      this.storage.getRedirectUrl() ? this.router.navigate([this.storage.getRedirectUrl()]) : this.router.navigate(['/dashboard']);
    },
    error: (error) => {
      this.loading.set(false);
      this.toastService.error(error)
    },
    complete: () => console.log('Observable complete')
  };

  private formData = (code: string) => getFormData({ code, client_id: 'client', code_verifier: '4v5LOvtMfo6MuopFl9wZt81wVXNmYR92-H7QG-jx-c681LybBeci9Gylg2gGO_hyA74gkapjVEexH1N8Msakf7GsTyyZ-YAVP76vJ7YnB2L3eISZBmteQCNgUqdZKugV', grant_type: 'authorization_code', redirect_uri: 'http://localhost:3000' }, null);

  private saveToken = (data: IAuthentication) => {
    this.storage.set(Key.TOKEN, data.access_token);
    this.storage.set(Key.REFRESH_TOKEN, data.refresh_token);
  };

}
