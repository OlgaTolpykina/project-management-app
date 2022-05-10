import { Component, ViewChild, ElementRef, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Column } from '@shared/types/column.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectUsers } from '@app/redux/selectors/selectors';
import { AppState } from '@app/redux/state.model';
import { TaskService } from '@shared/services/task.service';
import { Observable, Subject, takeUntil, map, take } from 'rxjs';
import { selectSelectedBoardId } from '@app/redux/selectors/selectors';
import { setSelectedBoardId } from '@app/redux/actions/board.actions';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent implements OnInit, OnDestroy {
  @ViewChild('titleinput') input: ElementRef | undefined;

  selectedBoardId$: Observable<string> = this.store.select(selectSelectedBoardId);

  users$ = this.store.select(selectUsers);

  selectedBoardId: string | undefined;

  unsubscribe$ = new Subject<void>();

  isEditEnable = true;

  taskForm = this.fb.group({
    title: ['Task title', [Validators.required, Validators.maxLength(50)]],
    desc: ['', [Validators.required, Validators.maxLength(255)]],
    userId: ['', Validators.required],
  });

  get title() {
    return this.taskForm.get('title');
  }

  get desc() {
    return this.taskForm.get('desc');
  }

  get user() {
    return this.taskForm.get('userId');
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { column: Column },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTaskComponent>,
    private store: Store<AppState>,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this.selectedBoardId$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((id) => (this.selectedBoardId = id));
  }

  onEdit(): void {
    this.isEditEnable = !this.isEditEnable;
    if (this.isEditEnable) setTimeout(() => this.input?.nativeElement.focus(), 0);
    if (!this.input?.nativeElement.value) {
      this.isEditEnable = true;
      return;
    }
  }

  onCreateTask(): void {
    if (this.taskForm.status === 'VALID') {
      let lastOrder = 1;
      if (this.data.column.tasks?.length) {
        lastOrder = this.data.column.tasks[this.data.column.tasks.length - 1].order + 1;
      }

      if (this.selectedBoardId && this.data.column.id) {
        this.taskService
          .createTask(this.selectedBoardId, this.data.column.id, {
            title: this.title?.value,
            description: this.desc?.value,
            userId: this.user?.value,
            order: lastOrder,
            done: false,
          })
          .pipe(
            map(() => {
              if (this.selectedBoardId)
                this.store.dispatch(setSelectedBoardId({ selectedBoardId: this.selectedBoardId }));
            }),
            take(1),
          )
          .subscribe();
      }

      this.dialogRef.close();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }
}
