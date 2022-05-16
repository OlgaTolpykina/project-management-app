import { Component, ViewChild, ElementRef, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Task } from '@shared/types/task.model';
import { Store } from '@ngrx/store';
import { selectUsers, selectSelectedBoardId } from '@app/redux/selectors/selectors';
import { AppState } from '@app/redux/state.model';
import { Observable, takeUntil, Subject, map, take } from 'rxjs';
import { TaskService } from '@shared/services/task.service';
import { setSelectedBoardId } from '@app/redux/actions/board.actions';
import { FileService } from '@shared/services/file.service';
import { File } from '@shared/types/file.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss'],
})
export class UpdateTaskComponent implements OnInit, OnDestroy {
  @ViewChild('titleinput') input: ElementRef | undefined;

  users$ = this.store.select(selectUsers);

  selectedBoardId$: Observable<string> = this.store.select(selectSelectedBoardId);

  selectedBoardId: string | undefined;

  unsubscribe$ = new Subject<void>();

  files: File[] = [];

  taskForm = this.fb.group({
    title: [this.data.task.title, [Validators.required, Validators.maxLength(50)]],
    desc: [this.data.task.description, [Validators.required, Validators.maxLength(255)]],
    userId: [this.data.task.userId, Validators.required],
    done: [this.data.task.done, Validators.required],
  });

  isTitleEditEnable = false;

  get title() {
    return this.taskForm.get('title');
  }

  get desc() {
    return this.taskForm.get('desc');
  }

  get user() {
    return this.taskForm.get('userId');
  }

  get done() {
    return this.taskForm.get('done');
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { task: Task; columnId: string | undefined },
    private dialogRef: MatDialogRef<UpdateTaskComponent>,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private taskService: TaskService,
    private fileService: FileService,
  ) {}

  ngOnInit(): void {
    this.selectedBoardId$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((id) => (this.selectedBoardId = id));

    if (this.data.task.files) this.files = this.data.task.files;
  }

  onEdit(): void {
    this.isTitleEditEnable = !this.isTitleEditEnable;
    if (this.isTitleEditEnable) setTimeout(() => this.input?.nativeElement.focus(), 0);
    if (!this.input?.nativeElement.value) {
      this.isTitleEditEnable = true;
      return;
    }
  }

  onUpdateTask(): void {
    if (this.taskForm.status === 'VALID') {
      if (this.selectedBoardId && this.data.columnId && this.data.task.id) {
        this.taskService
          .updateTask(this.selectedBoardId, this.data.columnId, this.data.task.id, {
            title: this.title?.value,
            description: this.desc?.value,
            userId: this.user?.value,
            order: +this.data.task.order,
            done: this.done?.value,
            boardId: this.selectedBoardId,
            columnId: this.data.columnId,
          })
          .pipe(take(1))
          .subscribe(() => {
            if (this.selectedBoardId)
              this.store.dispatch(setSelectedBoardId({ selectedBoardId: this.selectedBoardId }));
          });
      }
    }
    this.dialogRef.close();
  }

  onUploadFile(e: Event): void {
    const formData = new FormData();
    if (this.data.task.id !== undefined) {
      formData.append('taskId', this.data.task.id);
      formData.append('file', ((<HTMLInputElement>e.target).files as FileList)[0]);
      this.fileService
        .uploadFile(formData)
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

  onDownloadFile(file: File): void {
    if (this.data.task.id)
      this.fileService.downloadFile(this.data.task.id, file.filename).subscribe((res) => {
        let blob = new Blob([res], { type: 'image/jpeg' });
        saveAs(blob, file.filename);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }
}
