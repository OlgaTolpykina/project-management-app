import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ProgressBarService } from '@core/services/loading/progress-bar.service';
import { environment } from '@environments/environment';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private progressBar: ProgressBarService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.method === ('GET' || 'POST') && request.url === environment.BASE_URL) {
      this.progressBar.show();
      return next.handle(request).pipe(
        tap((event: HttpEvent<unknown>) => {
          if (event instanceof HttpResponse) {
            this.progressBar.hide();
          }
        }),
        catchError((error) => {
          this.progressBar.hide();
          return throwError(() => new Error(error));
        }),
      );
    }
    return next.handle(request);
  }
}
