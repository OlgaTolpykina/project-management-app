import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { createNewColumn, getAllColumns } from '@app/redux/actions/column.actions';
import { selectSelectedBoardId } from '@app/redux/selectors/board.selectors';
import { selectColumns } from '@app/redux/selectors/column.selectors';
import { AppState } from '@app/redux/state.model';
import { Store } from '@ngrx/store';
import { ColumnService } from '@shared/services/column.service';
import { Column } from '@shared/types/column.model';
import { map, Observable, Subject, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-column',
  templateUrl: './create-column.component.html',
  styleUrls: ['./create-column.component.scss'],
})
export class CreateColumnComponent implements OnDestroy {
  unsubscribe$ = new Subject<void>();

  selectedBoardId$: Observable<string> = this.store.select(selectSelectedBoardId);

  allColumns$: Observable<Column[] | undefined> = this.store.select(selectColumns);

  newColumn: Column = {
    title: '',
    order: 0,
  };

  title = new FormControl('', [Validators.required, Validators.maxLength(50)]);

  constructor(private columnService: ColumnService, private store: Store<AppState>) {}

  onCreateColumn() {
    if (this.title?.valid) {
      this.selectedBoardId$
        .pipe(
          map((id) => id),
          switchMap((id) => {
            const selectedBoardId = id;
            return this.allColumns$.pipe(
              map((columns) => columns),
              take(1),
              switchMap((columns) => {
                if (columns) columns = this.checkColumnsOrder(columns, id);
                this.newColumn.title = this.title.value;
                this.newColumn.order = columns?.length ? columns!.length + 1 : 1;
                return this.columnService
                  .createColumn(selectedBoardId, this.newColumn)
                  .pipe(map((column) => this.store.dispatch(createNewColumn({ column: column }))));
              }),
            );
          }),
        )
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe();
    }
  }

  checkColumnsOrder(columns: Column[], boardId: string) {
    let isUpdated = false;
    const checkedColumns = [...columns];
    checkedColumns.sort((a, b) => (a.order > b.order ? 1 : -1));
    checkedColumns.map((column, index) => {
      if (column.order !== index + 1) {
        isUpdated = true;
        console.log(column.order, index);
        const updatedColumn = {
          title: column.title,
          order: index + 1,
        };
        this.columnService.updateColumn(boardId, column.id!, updatedColumn);
      }
    });
    if (isUpdated) this.store.dispatch(getAllColumns());
    return checkedColumns;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
