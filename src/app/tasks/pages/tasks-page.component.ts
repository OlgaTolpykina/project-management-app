import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  selectSelectedBoardColumns,
  selectSelectedBoardId,
  selectSelectedBoardTitle,
} from '@app/redux/selectors/selectors';
import { AppState } from '@app/redux/state.model';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { CreateColumnComponent } from '../components/create-column/create-column.component';
import { getAllUsers } from '@app/redux/actions/users.actions';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { concatMap, from, Subject, takeUntil } from 'rxjs';
import { ColumnService } from '@shared/services/column.service';
import { Column } from '@shared/types/column.model';
import { setSelectedBoardId } from '@app/redux/actions/board.actions';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss'],
})

export class TasksPageComponent implements OnInit, OnDestroy {
  board$ = this.store.select(selectSelectedBoardTitle);

  boardId$ = this.store.select(selectSelectedBoardId);

  columns$ = this.store.select(selectSelectedBoardColumns);

  columns: Column[] = [];

  boardId = '';

  unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private columnService: ColumnService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(getAllUsers());
    
    this.columns$.pipe(takeUntil(this.unsubscribe$)).subscribe((columns) => {
      if (columns) {
        this.columns = [...columns].sort((a, b) => (a.order > b.order ? 1 : -1));
      }
    });
    this.boardId$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((boardId) => (this.boardId = boardId));
  }

  openDialog() {
    this.dialog.open(CreateColumnComponent, {
      height: '400px',
      width: '300px',
    });
  }

  drop(event: CdkDragDrop<Column[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    const updatedColumns: Column[] = [];
    this.columns.forEach((column, index) => {
      if (index === 0) {
        column = {
          id: column.id,
          title: column.title,
          order: 0,
        };
        updatedColumns.push(column);
      } else {
        column = {
          id: column.id,
          title: column.title,
          order: index + 1,
        };
        updatedColumns.push(column);
      }
    });
    updatedColumns.push({
      id: this.columns[0].id,
      title: this.columns[0].title,
      order: 1,
    });

    from(updatedColumns)
      .pipe(
        concatMap((column) =>
          this.columnService.updateColumn(this.boardId, column.id!, {
            title: column.title,
            order: column.order,
          }),
        ),
      )
      .subscribe({
        complete: () => this.store.dispatch(setSelectedBoardId({ selectedBoardId: this.boardId })),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
