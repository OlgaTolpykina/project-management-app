import { Pipe, PipeTransform } from '@angular/core';
import { Column } from '@shared/types/column.model';
import { Task } from '@shared/types/task.model';

@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  transform<T extends Column | Task>(elements: T[], sortValue: number): T[] {
    if (!sortValue) return elements;

    return elements.sort((a, b) => (a.order > b.order ? 1 : -1));
  }
}
