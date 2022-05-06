import { Component } from '@angular/core';
import {
  selectSelectedBoardColumns,
  selectSelectedBoardTitle,
} from '@app/redux/selectors/selectors';
import { AppState } from '@app/redux/state.model';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { CreateColumnComponent } from '../components/create-column/create-column.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss'],
})
export class TasksPageComponent {
  board$ = this.store.select(selectSelectedBoardTitle);

  columns$ = this.store.select(selectSelectedBoardColumns);

  constructor(private store: Store<AppState>, public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(CreateColumnComponent, {
      height: '400px',
      width: '300px',
    });
  }
}
