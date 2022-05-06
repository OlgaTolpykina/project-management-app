import { Component, Input, OnInit } from '@angular/core';
import { Column } from '@shared/types/column.model';
import { Task } from '@shared/types/task.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskComponent } from '../../components/create-task/create-task.component';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit {
  @Input() column: Column | undefined;

  isEditEnable: boolean = false;

  name = 'Title';

  tasks: Task[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.column) this.name = this.column.title;
    if (this.column && this.column.tasks) this.tasks = this.column.tasks;
  }

  onEdit() {
    this.isEditEnable = !this.isEditEnable;
  }

  openTaskDialog(): void {
    this.dialog.open(CreateTaskComponent, {
      height: '400px',
      width: '320px',
    });
  }
}
