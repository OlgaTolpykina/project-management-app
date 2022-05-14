import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '@app/redux/state.model';
import { Store } from '@ngrx/store';
import { Column } from '@shared/types/column.model';
import { Task } from '@shared/types/task.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskComponent } from '../../components/create-task/create-task.component';
import { ColumnService } from '@shared/services/column.service';
import { map, Observable, Subject, switchMap, take, takeUntil } from 'rxjs';
import { selectSelectedBoardId } from '@app/redux/selectors/selectors';
import { setSelectedBoardId } from '@app/redux/actions/board.actions';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  @Input() column: Column | undefined;

  selectedBoardId$: Observable<string> = this.store.select(selectSelectedBoardId);

  isEditEnable: boolean = false;

  name = 'Title';

  tasks: Task[] = [];

  constructor(
    private store: Store<AppState>,
    private columnService: ColumnService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (this.column) this.name = this.column.title;
    if (this.column && this.column.tasks) this.tasks = this.column.tasks;
  }

  onEdit(e: Event) {
    e.stopPropagation();
    this.isEditEnable = !this.isEditEnable;
  }

  onUpdate(e: Event) {
    e.stopPropagation();
    this.isEditEnable = !this.isEditEnable;
    this.selectedBoardId$
      .pipe(
        map((selectedBoardId) => selectedBoardId),
        switchMap((selectedBoardId) =>
          this.columnService
            .updateColumn(selectedBoardId, this.column!.id!, {
              title: this.name,
              order: +this.column?.order!,
            })
            .pipe(map(() => this.store.dispatch(setSelectedBoardId({ selectedBoardId })))),
        ),
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  onDelete(e: Event): void {
    e.stopPropagation();
    if (this.column?.id) {
      this.selectedBoardId$
        .pipe(
          take(1),
          map((id) => id),
          switchMap((id) => {
            return this.columnService.deleteColumn(id, this.column!.id!);
          }),
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openTaskDialog(): void {
    this.dialog.open(CreateTaskComponent, {
      height: '400px',
      width: '320px',
      data: { column: this.column },
    });
  }
}
