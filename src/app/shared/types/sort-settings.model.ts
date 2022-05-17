import { Task } from './task.model';

export interface SortSettings {
  sortBy: keyof Task;
  decrease: boolean;
}
