import { File } from './file.model';

export interface Task {
  id?: string;
  title: string;
  order: number;
  done?: boolean;
  description: string;
  userId: string;
  boardId?: string;
  columnId?: string;
  files?: File[];
}
