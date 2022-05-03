import { Pipe, PipeTransform } from '@angular/core';
import { Column } from '@shared/types/column.model';

@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  transform(columns: Column[], sortValue: number): Column[] {
    if (!sortValue) return columns;

    return columns.sort((a, b) => (a.order > b.order ? 1 : -1));
  }
}
