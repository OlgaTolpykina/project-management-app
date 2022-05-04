import { Component, Input } from '@angular/core';

import { Board } from '@shared/types/board.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { BoardService } from '@shared/services/board.service';
import { deleteBoard } from '@app/redux/actions/board.actions';

@Component({
  selector: 'app-board-item',
  templateUrl: './board-item.component.html',
  styleUrls: ['./board-item.component.scss'],
})
export class BoardItemComponent {
  @Input() board: Board | undefined;

  @Input() backgroundImgUrl: string | undefined;

  constructor(private router: Router, private boardService: BoardService, private store: Store) {}

  onDelete(e: Event): void {
    e.stopPropagation();
    if (this.board?.id)
      this.boardService.deleteBoardById(this.board.id).subscribe((data) => {
        if (!(data instanceof Error) && this.board?.id)
          this.store.dispatch(deleteBoard({ id: this.board.id }));
      });
  }
}
