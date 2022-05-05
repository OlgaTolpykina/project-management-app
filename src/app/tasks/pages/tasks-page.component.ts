import { Component } from '@angular/core';
import { selectSelectedBoardTitle } from '@app/redux/selectors';
import { AppState } from '@app/redux/state.model';
import { Store } from '@ngrx/store';
import { selectSelectedBoardId, selectSelectedBoardColumns } from '../../redux/selectors';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss'],
})
export class TasksPageComponent {
  board$ = this.store.select(selectSelectedBoardTitle);

  boardId$ = this.store.select(selectSelectedBoardId);

  columns$ = this.store.select(selectSelectedBoardColumns);

  constructor(private store: Store<AppState>) {}
}
