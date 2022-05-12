import { Injectable } from '@angular/core';
import { setSelectedBoardId } from '@app/redux/actions/board.actions';
import { selectSelectedBoardId } from '@app/redux/selectors/selectors';
import { AppState } from '@app/redux/state.model';
import { Store } from '@ngrx/store';
import { ColumnService } from '@shared/services/column.service';
import { map, Observable, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateOrderService {
  boardId$: Observable<string> = this.store.select(selectSelectedBoardId);

  constructor(private store: Store<AppState>, private columnService: ColumnService) {}

  updateColumnOrder() {
    return this.boardId$.pipe(
      take(1),
      map((boardId) => boardId),
      switchMap((boardId) =>
        this.columnService.getAllColumns(boardId).pipe(
          map((columns) => {
            if (columns?.length) {
              const updatedColumns = [...columns].sort((a, b) => (a.order > b.order ? 1 : -1));
              updatedColumns.forEach((column, index) => {
                if (column.order !== index + 1) {
                  const updatedColumn = {
                    title: column.title,
                    order: index + 1,
                  };
                  this.columnService
                    .updateColumn(boardId, column.id!, updatedColumn)
                    .subscribe(() =>
                      this.store.dispatch(setSelectedBoardId({ selectedBoardId: boardId })),
                    );
                }
              });
            }
          }),
        ),
      ),
    );
  }
}
