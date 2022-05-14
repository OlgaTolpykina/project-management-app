import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject, takeUntil } from 'rxjs';

import { UserAuthServiceService } from '@auth/services/user-auth-service.service';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrls: ['./message-page.component.scss'],
})
export class MessagePageComponent implements OnInit, OnDestroy {
  messageForUser: string = 'Hello';

  authService: UserAuthServiceService;

  subscription: Subscription;

  unsubscribe$ = new Subject<void>();

  constructor(authService: UserAuthServiceService) {
    this.authService = authService;
    this.subscription = this.authService.changeMessage$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((message) => {
        this.messageForUser = message;
      });
  }

  ngOnInit(): void {
    this.messageForUser = this.authService.messageForUser;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
