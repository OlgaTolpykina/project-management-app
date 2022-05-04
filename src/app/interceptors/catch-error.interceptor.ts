import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NotificationService } from '@core/services/notifications/notification.service';
import { Messages } from '@shared/constants/constants';

@Injectable()
export class CatchErrorInterceptor implements HttpInterceptor {
  constructor(private notification: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        this.notification.showNotification(Messages.fetchError);
        return throwError(() => new Error(error));
      }),
    );
  }
}
