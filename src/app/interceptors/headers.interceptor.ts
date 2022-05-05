import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UserAuthServiceService } from '@auth/services/user-auth-service.service';
import { MessageService } from '@shared/services/message.service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  constructor(
    private authService: UserAuthServiceService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let headers = request.headers;

    if (request.method !== 'DELETE')
      headers = request.headers.set('Content-Type', 'application/json');

    //TODO: Maybe receive token from auth service
    const token = localStorage.getItem('token');

    if (request.url.includes('unsplash'))
      headers = headers.set(
        'Authorization',
        'Client-ID sh3V-2sbNtpVMAyIb1k3FrskCAotZPiDkYWZ9VuF9JY',
      );
    else if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    const newReq = request.clone({
      headers,
    });
    return next.handle(newReq).pipe(
      tap(
        (res) => {
          return res;
        },
        (err) => {
          this.authService.redirectUrl = this.router.url;
          if (err instanceof HttpErrorResponse) {
            console.log(err.statusText);
            if (err.status == 401) {
              this.authService.handleError(err);
              this.authService.logInOutUser('false');
            } else if (newReq.url.includes('boards')) {
              this.messageService.getMessageForUser(err.statusText, this.router.url);
            }
          }
        },
      ),
    );
  }
}
