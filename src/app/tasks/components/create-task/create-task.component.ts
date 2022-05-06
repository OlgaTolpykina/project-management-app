import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '@shared/types/user.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent {
  @ViewChild('titleinput') input: ElementRef | undefined;

  isEditEnable = true;

  users: User[] = [
    { id: 'fd2297ed-54ad-47bb-8d50-f26e2be5bd13', login: 'sergey_serzhan', name: 'Sergey Serzhan' },
    { id: 'fd2297ed-54ad-47bb-8d50-f26e2be5bd13', login: 'andrey_serzhan', name: 'Andrey Serzhan' },
    { id: 'fd2297ed-54ad-47bb-8d50-f26e2be5bd13', login: 'ivan_ivanov', name: 'Ivan Ivanov' },
  ];

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

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CreateTaskComponent>) {}

  onEdit(): void {
    this.isEditEnable = !this.isEditEnable;
    if (this.isEditEnable) setTimeout(() => this.input?.nativeElement.focus(), 0);
    if (!this.input?.nativeElement.value) {
      this.isEditEnable = true;
      return;
    }
  }

  onCreateTask(): void {
    if (this.taskForm.status === 'VALID') this.dialogRef.close();
  }
}
