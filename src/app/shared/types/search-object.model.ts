import { Task } from './task.model';
import { Board } from './board.model';
import { Column } from './column.model';

export interface SearchObject {
  boards?: Board[];
  columns?: Column[];
  tasks?: Task[];
}
