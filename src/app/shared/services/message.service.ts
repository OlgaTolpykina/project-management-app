import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { Error } from '@shared/types/error.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageForUser: string = '';

  redirectUrl: string = 'main';

  approveDeletion: boolean = false;

  request: HttpRequest<unknown> | null = null;

  constructor(public router: Router, private http: HttpClient) {}

  public getMessageForUser(
    message: string,
    redirectUrl: string | null = null,
    timeout: number | null = null,
  ): void {
    this.messageForUser = message;
    const url = redirectUrl ? redirectUrl : this.router.url;
    this.redirectUrl = url;
    this.router.navigate(['/message']);
    if (!(timeout === null)) {
      setTimeout(() => {
        this.messageForUser = '';
        this.router.navigate([url]);
      }, timeout);
    }
  }

  public getUserConfirmation(
    request: HttpRequest<unknown>,
    redirectUrl: string | null = null,
  ): void {
    this.messageForUser = 'delete confirmation';
    this.request = request;
    const url = redirectUrl ? redirectUrl : this.router.url;
    this.redirectUrl = url;
    this.router.navigate(['/message']);
  }

  public async sendDeleteRequest(): Promise<void> {
    console.log(this.request);
    this.approveDeletion = true;
    await this.http.request(this.request as HttpRequest<unknown>).subscribe(async (data) => {
      if (!(data instanceof Error)) {
        this.approveDeletion = false;
        this.router.navigate([this.redirectUrl]);
      }
    });
  }
}
