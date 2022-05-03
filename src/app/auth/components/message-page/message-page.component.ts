import { Component, OnInit } from '@angular/core';

import { UserAuthServiceService } from '@auth/services/user-auth-service.service';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrls: ['./message-page.component.scss'],
})
export class MessagePageComponent implements OnInit {
  messageForUser: string = 'Hello';

  authService: UserAuthServiceService;

  constructor(authService: UserAuthServiceService) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.messageForUser = this.authService.messageForUser;
  }
}
