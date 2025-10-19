import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { InMemoryScrollingFeature, provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { UserService } from './service/user.service';
import { StorageService } from './service/storage.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideDialogConfig } from '@ngneat/dialog';
import { NotificationService } from './service/notification.service';
import { TicketService } from './service/ticket.service';
import { ModalService } from './service/modal.service';
import { tokenInterceptor } from './interceptor/token.interceptor';
import { cacheInterceptor } from './interceptor/cache.interceptor';
import { CacheService } from './service/cache.service';

const dialogConfiguration = provideDialogConfig({
  closeButton: false,
  resizable: true
  /* enableClose:
    boolean |
    'onlyLastStrategy' |
    {
      escape: boolean | 'onlyLastStrategy',
      backdrop: boolean | 'onlyLastStrategy',
    },
  backdrop: boolean,
  resizable: boolean,
  draggable: boolean,
  overflow: boolean,
  draggableConstraint: none | bounce | constrain,
  sizes,
  size: sm | md | lg | fullScreen | string,
  windowClass: string,
  width: string | number,
  minWidth: string | number,
  maxWidth: string | number,
  height: string | number,
  minHeight: string | number,
  maxHeight: string | number, */
});

const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling({
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
});

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, inMemoryScrollingFeature, withComponentInputBinding()),
    dialogConfiguration,
    UserService, NotificationService, StorageService, TicketService, ModalService, CacheService,
    provideHttpClient(withInterceptors([tokenInterceptor, cacheInterceptor])),
    provideHotToastConfig({ position: 'top-right' })
  ]
};
