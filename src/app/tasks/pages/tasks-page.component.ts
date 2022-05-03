import { Component, OnInit } from '@angular/core';
import { selectSelectedBoardTitle } from '@app/redux/selectors';
import { AppState } from '@app/redux/state.model';
import { Store } from '@ngrx/store';
import { Column } from '@shared/types/column.model';

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

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.columns.forEach((column) => {
      this.columnOrder = column.order;
    });
  }
}
