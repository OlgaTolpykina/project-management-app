import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageForUser: string = '';

  redirectUrl: string = 'main';

  constructor(public router: Router) {}

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
}
