import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '@shared/types/task.model';

@Pipe({
  name: 'filterExec',
})
export class FilterExecPipe implements PipeTransform {
  transform(value: Task[], userId: string | undefined): Task[] {
    if (!userId) return value;

    return value.filter((task) => task.userId === userId);
  }
}
