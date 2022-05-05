import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ColumnService } from '@shared/services/column.service';
import { AppState } from '../state.model';
import { Action, Store } from '@ngrx/store';
import { catchError, map, Observable, of, switchMap, withLatestFrom } from 'rxjs';
import {
  getAllColumns,
  getAllColumnsFailed,
  getAllColumnsSuccessfully,
} from '../actions/column.actions';
import { selectSelectedBoardId } from '../selectors/board.selectors';

@Injectable({ providedIn: 'any' })
export class ColumnsEffects {
  constructor(
    private actions: Actions,
    private columnService: ColumnService,
    private store: Store<AppState>,
  ) {}

  getColumns: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(getAllColumns),
      withLatestFrom(this.store.select(selectSelectedBoardId)),
      switchMap(([, id]: [Action, string]) =>
        this.columnService.getAllColumns(id).pipe(
          map((columns) => getAllColumnsSuccessfully({ columns })),
          catchError((error) => of(getAllColumnsFailed({ error }))),
        ),
      ),
    ),
  );
}
