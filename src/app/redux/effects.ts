import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BoardService } from '@shared/services/board.service';
import { AppState } from './state.model';
import { Action, Store } from '@ngrx/store';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { getAllBoards, getAllBoardsFailed, getAllBoardsSuccessfully } from './actions';

@Injectable({ providedIn: 'any' })
export class BoardsEffects {
  constructor(
    private actions: Actions,
    private boardService: BoardService,
    private store: Store<AppState>,
  ) {}

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
