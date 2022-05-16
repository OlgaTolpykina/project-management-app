import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '@shared/types/task.model';

@Pipe({
  name: 'filterDone',
})
export class FilterDonePipe implements PipeTransform {
  transform(value: Task[], flag: boolean | undefined): Task[] {
    if (!flag) return value;
    return value.filter((task) => task.done === flag);
  }
}
