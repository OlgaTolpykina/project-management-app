import { Injectable } from '@angular/core';

import { SearchObject } from '@shared/types/search-odject.model';
import { BoardService } from './board.service';
import { ColumnService } from './column.service';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchObject: SearchObject = {
    boards: [],
  };

  constructor(
    private boardService: BoardService,
    private columnService: ColumnService,
    private taskService: TaskService,
  ) {}

  private getAllBoards() {
    this.boardService.getAllBoards().subscribe((boards) => {
      this.searchObject.boards = boards;
    });
  }
}
