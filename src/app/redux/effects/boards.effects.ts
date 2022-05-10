import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BoardService } from '@shared/services/board.service';
import { AppState } from '../state.model';
import { Action, Store } from '@ngrx/store';
import { catchError, map, Observable, of, switchMap, withLatestFrom } from 'rxjs';
import {
  getAllBoards,
  getAllBoardsFailed,
  getAllBoardsSuccessfully,
  setSelectedBoardId,
  getSelectedBoard,
  getSelectedBoardFailed,
  getSelectedBoardSuccessfully,
} from '../actions/board.actions';
import { selectSelectedBoardId } from '../selectors/selectors';

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

  getBoardById: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(setSelectedBoardId),
      withLatestFrom(this.store.select(selectSelectedBoardId)),
      switchMap(([, id]: [Action, string]) =>
        this.boardService.getBoardById(id).pipe(
          map((selectedBoard) => getSelectedBoardSuccessfully({ selectedBoard })),
          catchError((error) => of(getSelectedBoardFailed({ error }))),
        ),
      ),
    ),
  );

  getSelectedBoard: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(getSelectedBoard),
      withLatestFrom(this.store.select(selectSelectedBoardId)),
      switchMap(([, id]: [Action, string]) =>
        this.boardService.getBoardById(id).pipe(
          map((selectedBoard) => getSelectedBoardSuccessfully({ selectedBoard })),
          catchError((error) => of(getSelectedBoardFailed({ error }))),
        ),
      ),
    ),
  );
}
