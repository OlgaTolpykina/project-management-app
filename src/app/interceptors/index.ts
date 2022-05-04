import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CatchErrorInterceptor } from './catch-error.interceptor';
import { HeadersInterceptor } from './headers.interceptor';
import { LoadingInterceptor } from './loading.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: CatchErrorInterceptor, multi: true },
];
