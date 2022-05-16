import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '@shared/types/task.model';
import { selectUsers } from '@app/redux/selectors/selectors';
import { Store } from '@ngrx/store';
import { AppState } from '@app/redux/state.model';

@Pipe({
  name: 'filterExec',
})
export class FilterExecPipe implements PipeTransform {
  allUsers$ = this.store.select(selectUsers);

  constructor(private store: Store<AppState>) {}

  transform(value: Task[], execKeyword: string | undefined): Task[] {
    if (!execKeyword) return value;
    let newTasksArr: Task[] = [...value];

    this.allUsers$.subscribe((users) => {
      newTasksArr = newTasksArr.filter((task) => {
        return users
          ?.find((user) => user.id === task.userId)
          ?.name?.toLowerCase()
          .includes(execKeyword.toLowerCase());
      });
    });

    return newTasksArr;
  }
}
