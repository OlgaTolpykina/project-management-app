import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from '@shared/services/message.service';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.scss'],
})
export class UserMessageComponent {
  constructor(public messageService: MessageService, private router: Router) {}
}
