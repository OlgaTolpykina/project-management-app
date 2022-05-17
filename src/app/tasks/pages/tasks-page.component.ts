import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  selectSelectedBoardColumns,
  selectSelectedBoardId,
  selectSelectedBoardTitle,
  selectUsers,
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
import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss'],
})
export class TasksPageComponent implements OnInit, OnDestroy {
  board$ = this.store.select(selectSelectedBoardTitle);

  boardId$ = this.store.select(selectSelectedBoardId);

  columns$ = this.store.select(selectSelectedBoardColumns);

  users$ = this.store.select(selectUsers);

  columns: Column[] = [];

  isFilterBlockShown = false;

  columnToUpdate: Column = {
    id: '',
    title: '',
    order: 0,
  };

  boardId = '';

  unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private columnService: ColumnService,
    private filterService: FilterService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(getAllUsers());
    this.columns$.pipe(takeUntil(this.unsubscribe$)).subscribe((columns) => {
      if (columns) {
        this.columns = [...columns];
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

    if (event.currentIndex !== event.previousIndex) {
      const nextElementOrder =
        event.currentIndex < this.columns.length - 1
          ? +this.columns[event.currentIndex + 1].order
          : +this.columns[event.currentIndex - 1].order + 1;
      const previousElementOrder =
        event.currentIndex > 0 ? +this.columns[event.currentIndex - 1].order : 0;

      this.columnToUpdate.id = this.columns[event.currentIndex].id;
      this.columnToUpdate.title = this.columns[event.currentIndex].title;
      this.columnToUpdate.order = (nextElementOrder + previousElementOrder) / 2;

      this.columnService
        .updateColumn(this.boardId, this.columnToUpdate.id!, {
          title: this.columnToUpdate.title,
          order: this.columnToUpdate.order,
        })
        .subscribe({
          complete: () =>
            this.store.dispatch(setSelectedBoardId({ selectedBoardId: this.boardId })),
        });
    }
  }

  updateColumnOrders() {
    console.log('updatedColumns');
    const updatedColumns: Column[] = [];
    this.columns.forEach((column, index) => {
      if (+column.order !== index + 1) {
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
      }
    });

    if (updatedColumns.length) {
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
          complete: () =>
            this.store.dispatch(setSelectedBoardId({ selectedBoardId: this.boardId })),
        });
    }
  }

  toggleFilter(): void {
    this.isFilterBlockShown = !this.isFilterBlockShown;
  }

  onUserSelect(userId: string): void {
    this.filterService.setUser(userId);
  }

  onDoneChange(flag: boolean): void {
    this.filterService.setDone(flag);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
