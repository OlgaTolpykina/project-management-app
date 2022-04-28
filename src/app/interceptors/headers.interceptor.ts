import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let headers = request.headers;

    if (request.method !== 'DELETE')
      headers = request.headers.set('Content-Type', 'application/json');

    //TODO: Maybe receive token from auth service
    const token = localStorage.getItem('token');

    if (token)
      headers = headers.set(
        'Authorization',
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3YTM3ZWQxOS1kODE1LTRkZjktOTJiOC04MWRjNjMxZTNmOTQiLCJsb2dpbiI6InJhYmJpdCIsImlhdCI6MTY1MTEzMDk0NH0.mZ-70NSKXOYvicCGNHSoGFS0XorMrGJOmwJEOx7CfMU`,
      );
    const newReq = request.clone({
      headers,
    });
    return next.handle(newReq);
  }
}
