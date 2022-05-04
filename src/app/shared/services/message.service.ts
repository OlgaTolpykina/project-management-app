import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageForUser: string = '';

  redirectUrl: string = 'main';

  constructor(public router: Router) {}

  public getMessageForUser(message: string, redirectUrl?: string | null): void {
    this.messageForUser = message;
    const url = redirectUrl ? redirectUrl : this.router.url;
    this.router.navigate(['/message']);
    setTimeout(() => {
      this.messageForUser = '';
      this.router.navigate([url]);
    }, 3000);
  }
}
