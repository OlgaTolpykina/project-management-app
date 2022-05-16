import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { setSelectedBoardId } from '@app/redux/actions/board.actions';
import { selectSelectedBoardColumns, selectSelectedBoardId } from '@app/redux/selectors/selectors';
import { AppState } from '@app/redux/state.model';
import { Store } from '@ngrx/store';
import { ColumnService } from '@shared/services/column.service';
import { Column } from '@shared/types/column.model';
import { EMPTY, map, Observable, Subject, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-column',
  templateUrl: './create-column.component.html',
  styleUrls: ['./create-column.component.scss'],
})
export class CreateColumnComponent implements OnInit {
  unsubscribe$ = new Subject<void>();

  selectedBoardId$: Observable<string> = this.store.select(selectSelectedBoardId);

  selectedBoardId: string | undefined;

  allColumns$: Observable<Column[] | undefined> = this.store.select(selectSelectedBoardColumns);

  newColumn: Column = {
    title: '',
    order: 0,
  };

  title = new FormControl('', [Validators.required, Validators.maxLength(50)]);

  constructor(private columnService: ColumnService, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.selectedBoardId$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((id) => (this.selectedBoardId = id));
  }

  onCreateColumn() {
    if (this.title?.valid) {
      this.allColumns$
        .pipe(
          map((columns) => columns),
          take(1),
          switchMap((columns) => {
            let lastOrder = 1;
            if (columns?.length) {
              columns = this.checkColumnsOrder(columns);
              lastOrder = +columns[columns.length - 1].order + 1;
            }
            this.newColumn.title = this.title.value;
            this.newColumn.order = lastOrder;
            if (this.selectedBoardId) {
              return this.columnService.createColumn(this.selectedBoardId, this.newColumn).pipe(
                map(() => {
                  if (this.selectedBoardId)
                    this.store.dispatch(
                      setSelectedBoardId({ selectedBoardId: this.selectedBoardId }),
                    );
                }),
                take(1),
              );
            }
            return EMPTY;
          }),
        )
        .subscribe();
    }
  }

  checkColumnsOrder(columns: Column[]) {
    const checkedColumns = [...columns];
    checkedColumns.sort((a, b) => (a.order > b.order ? 1 : -1));
    return checkedColumns;
  }
}
