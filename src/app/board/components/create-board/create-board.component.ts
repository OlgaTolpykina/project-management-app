import { Component, OnInit } from '@angular/core';
import { BoardService } from '@shared/services/board.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/redux/state.model';
import { Board } from '@shared/types/board.model';
import { Error } from '@shared/types/error.model';
import { createNewBoard } from '@app/redux/actions/board.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss'],
})
export class CreateBoardComponent implements OnInit {
  formGroup: FormGroup | null = null;

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  onCreateBoard() {
    if (this.formGroup?.valid) {
      this.boardService
        .createBoard(this.formGroup.value)
        .pipe(take(1))
        .subscribe((data: Board | Error) => {
          if (!(data instanceof Error)) {
            this.store.dispatch(createNewBoard({ board: data as Board }));
          }
        });
    }
  }

  get title() {
    return this.formGroup!.get('title');
  }

  get description() {
    return this.formGroup!.get('description');
  }
}
