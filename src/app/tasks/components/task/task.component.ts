import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Task } from '@shared/types/task.model';
import { Store } from '@ngrx/store';
import { AppState } from '@app/redux/state.model';
import { selectUsers } from '@app/redux/selectors/selectors';
import { takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task: Task | undefined;

  userName: string = '';

  unsubscribe$ = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store
      .select(selectUsers)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (users) =>
          (this.userName = users?.find((user) => user.id === this.task?.userId)?.name || ''),
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }
}
