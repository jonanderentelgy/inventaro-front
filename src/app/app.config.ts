import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { errorInterceptor } from './core/constants/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    importProvidersFrom(FormsModule),
    provideTranslateService({
      useDefaultLang: false,
      fallbackLang: 'es',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    })
  ]
};
