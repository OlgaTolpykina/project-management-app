import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '@app/redux/state.model';
import { Store } from '@ngrx/store';
import { Column } from '@shared/types/column.model';
import { Task } from '@shared/types/task.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskComponent } from '../../components/create-task/create-task.component';
import { ColumnService } from '@shared/services/column.service';
import { concatMap, from, map, Observable, Subject, switchMap, take, takeUntil } from 'rxjs';
import { selectSelectedBoardColumns, selectSelectedBoardId } from '@app/redux/selectors/selectors';
import { setSelectedBoardId } from '@app/redux/actions/board.actions';
import { TaskService } from '@shared/services/task.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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

  boardId = '';

  columns$ = this.store.select(selectSelectedBoardColumns);

  columns: Column[] = [];

  constructor(
    private store: Store<AppState>,
    private columnService: ColumnService,
    private dialog: MatDialog,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    if (this.column) this.name = this.column.title;
    if (this.column && this.column.tasks) this.tasks = [...this.column.tasks];
    this.selectedBoardId$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((boardId) => (this.boardId = boardId));
    this.columns$.pipe(takeUntil(this.unsubscribe$)).subscribe((columns) => {
      if (columns) {
        this.columns = [...columns];
      }
    });
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

  openTaskDialog(): void {
    this.dialog.open(CreateTaskComponent, {
      height: '400px',
      width: '320px',
      data: { column: this.column },
    });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      if (event.currentIndex !== event.previousIndex && this.column!.id) {
        this.updateDroppedTask(event, this.column!.id);
      }
    } else if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      let previousColumnId = '';
      let taskDropped: Task | undefined;
      this.columns.forEach((column) => {
        if (column.tasks) {
          taskDropped = column.tasks.find(
            (task) => task.id === event.container.data[event.currentIndex].id,
          );
        }
        if (taskDropped) previousColumnId = column.id!;
      });
      this.updateDroppedTask(event, previousColumnId);
    }
  }

  updateDroppedTask(event: CdkDragDrop<Task[]>, columnId: string) {
    let newOrder = 1;
    if (this.tasks.length > 1) {
      const nextElementOrder =
        event.currentIndex < this.tasks.length - 1
          ? +this.tasks[event.currentIndex + 1].order
          : +this.tasks[event.currentIndex - 1].order + 1;
      const previousElementOrder =
        event.currentIndex > 0 ? +this.tasks[event.currentIndex - 1].order : 0;
      newOrder = (nextElementOrder + previousElementOrder) / 2;
    }

    if (this.boardId && this.tasks[event.currentIndex].id) {
      this.taskService
        .updateTask(this.boardId, columnId, this.tasks[event.currentIndex].id!, {
          title: this.tasks[event.currentIndex].title,
          description: this.tasks[event.currentIndex].description,
          userId: this.tasks[event.currentIndex].userId,
          order: newOrder,
          done: this.tasks[event.currentIndex].done,
          boardId: this.boardId,
          columnId: this.column!.id,
        })
        .pipe(
          map(() => {
            if (this.boardId)
              this.store.dispatch(setSelectedBoardId({ selectedBoardId: this.boardId }));
          }),
          take(1),
        )
        .subscribe();
    }
  }

  updateTasksOrders() {
    console.log('updatedTasks');
    const updatedTasks: Task[] = [];
    if (this.column && this.column.id && this.column.tasks) {
      this.tasks.forEach((task, index) => {
        if (+task.order !== index + 1) {
          if (index === 0) {
            task = {
              id: task.id,
              title: task.title,
              description: task.description,
              userId: task.userId,
              order: 0,
              done: task.done,
              boardId: this.boardId,
              columnId: this.column!.id,
            };
            updatedTasks.push(task);
          } else {
            task = {
              id: task.id,
              title: task.title,
              description: task.description,
              userId: task.userId,
              order: index + 1,
              done: task.done,
              boardId: this.boardId,
              columnId: this.column!.id,
            };
            updatedTasks.push(task);
          }
        }
      });
    }

    if (updatedTasks.length) {
      updatedTasks.push({
        id: this.column!.tasks![0].id,
        title: this.column!.tasks![0].title,
        description: this.column!.tasks![0].description,
        userId: this.column!.tasks![0].userId,
        order: 1,
        done: this.column!.tasks![0].done,
        boardId: this.boardId,
        columnId: this.column!.id,
      });
      from(updatedTasks)
        .pipe(
          concatMap((task) =>
            this.taskService.updateTask(this.boardId, this.column?.id!, task.id!, {
              title: task.title,
              description: task.description,
              userId: task.userId,
              order: task.order,
              done: task.done,
              boardId: this.boardId,
              columnId: this.column!.id,
            }),
          ),
        )
        .subscribe({
          complete: () =>
            this.store.dispatch(setSelectedBoardId({ selectedBoardId: this.boardId })),
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
