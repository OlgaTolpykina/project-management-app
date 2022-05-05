import { Injectable } from '@angular/core';
import { getAllColumns } from '@app/redux/actions/column.actions';
import { selectSelectedBoardId } from '@app/redux/selectors/board.selectors';
import { selectColumns } from '@app/redux/selectors/column.selectors';
import { AppState } from '@app/redux/state.model';
import { Store } from '@ngrx/store';
import { ColumnService } from '@shared/services/column.service';
import { Column } from '@shared/types/column.model';
import { map, Observable, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateOrderService {
  boardId$: Observable<string> = this.store.select(selectSelectedBoardId);

  allColumns$: Observable<Column[]> = this.store.select(selectColumns);

  constructor(private store: Store<AppState>, private columnService: ColumnService) {}

  updateOrder() {
    let isUpdated = false;
    return this.boardId$.pipe(
      map((boardId) => boardId),
      switchMap((boardId) => {
        return this.allColumns$.pipe(
          map((columns) => [...columns].sort((a, b) => (a.order > b.order ? 1 : -1))),
          map((columns) => {
            if (columns) {
              columns.forEach((column, index) => {
                if (column.order !== index + 1) {
                  isUpdated = true;
                  const updatedColumn = {
                    title: column.title,
                    order: index + 1,
                  };
                  this.columnService
                    .updateColumn(boardId, column.id!, updatedColumn)
                    .pipe(take(1))
                    .subscribe();
                }
              });
            }
            if (isUpdated) this.store.dispatch(getAllColumns());
          }),
        );
      }),
    );
  }
}
