import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './auth/interceptors/auth.interceptor';
import { provideTransloco } from '@ngneat/transloco';
import { translocoConfig } from '@ngneat/transloco';
import { TranslocoHttpLoader } from './transloco.loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideTransloco({
      config: translocoConfig({
        availableLangs: ['es', 'en'],
        defaultLang: 'es',
        reRenderOnLangChange: true,
        prodMode: false
      }),
      loader: TranslocoHttpLoader
    })
  ],
};
