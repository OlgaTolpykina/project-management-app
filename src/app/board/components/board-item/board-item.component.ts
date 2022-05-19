import { Component, Input } from '@angular/core';
import { Board } from '@shared/types/board.model';
import { BoardService } from '@shared/services/board.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-board-item',
  templateUrl: './board-item.component.html',
  styleUrls: ['./board-item.component.scss'],
})
export class BoardItemComponent {
  @Input() board: Board | undefined;

  @Input() backgroundImgUrl: string | undefined;

  constructor(private boardService: BoardService) {}

  onDelete(e: Event): void {
    e.stopPropagation();
    if (this.board?.id) this.boardService.deleteBoardById(this.board.id).pipe(take(1)).subscribe();
  }
}
