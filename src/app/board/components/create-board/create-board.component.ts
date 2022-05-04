import { Component } from '@angular/core';
import { BoardService } from '@shared/services/board.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/redux/state.model';
import { Board } from '@shared/types/board.model';
import { Error } from '@shared/types/error.model';
import { createNewBoard } from '@app/redux/actions/board.actions';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss'],
})
export class CreateBoardComponent {
  title = new FormControl('', [Validators.required, Validators.maxLength(50)]);

  constructor(private boardService: BoardService, private store: Store<AppState>) {}

  onCreateBoard() {
    if (this.title?.valid) {
      this.boardService.createBoard(this.title.value).subscribe((data: Board | Error) => {
        if (!(data instanceof Error)) {
          this.store.dispatch(createNewBoard({ board: data as Board }));
        }
      });
    }
  }
}
