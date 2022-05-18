import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Task } from '@shared/types/task.model';
import { Store } from '@ngrx/store';
import { AppState } from '@app/redux/state.model';
import { selectUsers, selectSelectedBoardId } from '@app/redux/selectors/selectors';
import { takeUntil, Subject, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTaskComponent } from '@tasks/components/update-task/update-task.component';
import { TaskService } from '@shared/services/task.service';
import { setSelectedBoardId } from '@app/redux/actions/board.actions';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task: Task | undefined;

  @Input() columnId: string | undefined;

  selectedBoardId: string | undefined;

  userName: string = '';

  unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectUsers)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (users) =>
          (this.userName = users?.find((user) => user.id === this.task?.userId)?.name || ''),
      );

    this.store
      .select(selectSelectedBoardId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((boardId) => (this.selectedBoardId = boardId));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }

  onEdit(): void {
    this.dialog.open(UpdateTaskComponent, {
      width: '600px',
      data: {
        task: this.task,
        columnId: this.columnId,
      },
      panelClass: 'custom-modal',
    });
  }

  onDelete(): void {
    if (this.task && this.selectedBoardId && this.columnId && this.task.id) {
      this.taskService
        .deleteTask(this.selectedBoardId, this.columnId, this.task.id)
        .pipe(take(1))
        .subscribe((data) => {
          if (!(data instanceof Error) && this.selectedBoardId)
            this.store.dispatch(setSelectedBoardId({ selectedBoardId: this.selectedBoardId }));
        });
    }
  }
}
