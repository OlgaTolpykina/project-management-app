import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BoardService } from '@shared/services/board.service';
import { Action } from '@ngrx/store';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import {
  getAllBoards,
  getAllBoardsFailed,
  getAllBoardsSuccessfully,
} from '../actions/board.actions';

@Injectable({ providedIn: 'any' })
export class BoardsEffects {
  constructor(private actions: Actions, private boardService: BoardService) {}

  getBoards: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(getAllBoards),
      switchMap(() =>
        this.boardService.getAllBoards().pipe(
          map((boards) => getAllBoardsSuccessfully({ boards })),
          catchError((error) => of(getAllBoardsFailed({ error }))),
        ),
      ),
    ),
  );
}
