import { Component, OnInit } from '@angular/core';
import { selectSelectedBoardTitle } from '@app/redux/selectors/board.selectors';
import { AppState } from '@app/redux/state.model';
import { Store } from '@ngrx/store';
import { Column } from '@shared/types/column.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateColumnComponent } from '../components/create-column/create-column.component';
import { map, Observable } from 'rxjs';
import { getAllColumns } from '@app/redux/actions/column.actions';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss'],
})
export class TasksPageComponent implements OnInit {
  board$ = this.store.select(selectSelectedBoardTitle);

  columns: Column[] = [
    {
      id: '08cc10f4-1aeb-4cce-9793-9fea8313b592',
      title: 'Done',
      order: 2,
    },
    {
      id: '08cc10f4-1aeb-4cce-9793-9fea8313b593',
      title: 'In review',
      order: 1,
    },
  ];

  columnOrder = 0;

  columns$: Observable<Column[]> = this.store.pipe(
    map((data) => {
      return [...data.columns.columns, ...this.columns];
    }),
  );

  constructor(private store: Store<AppState>, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.columns.forEach((column) => {
      this.columnOrder = column.order;
    });
    this.store.dispatch(getAllColumns());
  }

  openDialog() {
    this.dialog.open(CreateColumnComponent, {
      height: '400px',
      width: '300px',
    });
  }
}
