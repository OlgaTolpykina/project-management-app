import { Component, Input } from '@angular/core';

import { Board } from '@shared/types/board.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-item',
  templateUrl: './board-item.component.html',
  styleUrls: ['./board-item.component.scss'],
})
export class BoardItemComponent {
  @Input() board: Board | undefined;

  @Input() backgroundImgUrl: string | undefined;

  constructor(private router: Router) {}

  onDelete(e: Event): void {
    e.stopPropagation();
    this.router.navigate(['/home']);
  }
}
