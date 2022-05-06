import { Injectable } from '@angular/core';
import { selectSelectedBoardColumns, selectSelectedBoardId } from '@app/redux/selectors/selectors';
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

  allColumns$: Observable<Column[] | undefined> = this.store.select(selectSelectedBoardColumns);

  constructor(private store: Store<AppState>, private columnService: ColumnService) {}

  updateOrder() {
    return this.boardId$.pipe(
      map((boardId) => boardId),
      switchMap((boardId) => {
        return this.allColumns$.pipe(
          map((columns) => {
            if (columns?.length) {
              return [...columns].sort((a, b) => (a.order > b.order ? 1 : -1));
            }
            return [];
          }),
          map((columns) => {
            if (columns.length) {
              columns.forEach((column, index) => {
                if (column.order !== index + 1) {
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
          }),
        );
      }),
    );
  }
}
