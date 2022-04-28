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

    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    const newReq = request.clone({
      headers,
    });
    return next.handle(newReq);
  }
}
