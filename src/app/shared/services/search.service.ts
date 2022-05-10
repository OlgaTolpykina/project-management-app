import { Injectable } from '@angular/core';

import { SearchObject } from '@shared/types/search-object.model';
import { BoardService } from '@shared/services/board.service';
import { ColumnService } from '@shared/services/column.service';
import { TaskService } from '@shared/services/task.service';
import { UserAuthServiceService } from '@auth/services/user-auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchObject: SearchObject = {
    tasks: [],
    boards: [],
    columns: [],
  };

  filteredSearchResult: Task[] = [];

  searchString: string = '';

  constructor(
    private boardService: BoardService,
    private columnService: ColumnService,
    private taskService: TaskService,
    private authService: UserAuthServiceService,
  ) {}

  private async getAllBoards(): Promise<void> {
    this.boardService.getAllBoards().subscribe((boards) => {
      this.searchObject.boards = boards;
    });
  }

  private async getAllColumns(): Promise<void> {
    this.searchObject.boards.forEach((board) => {
      this.columnService.getAllColumns(board.id).subscribe((columns) => {
        this.searchObject.columns = this.searchObject.columns.concat(columns);
      });
    });
  }

  private async getAllTasks() {
    await this.getAllBoards();
    await this.getAllColumns();
    this.searchObject.columns.forEach((column) => {
      this.taskService.getAllTasks(column.id).subscribe((tasks) => {
        this.searchObject.tasks = this.searchObject.tasks.concat(tasks);
      });
    });
  }

  public async searchSubmit(): Promise<void> {
    const MINIMAL_REQUEST_LENGTH: number = 2;
    if (this.authService.isAuthorized !== 'true') {
      this.authService.getMessageForUser('signIn first', 'home');
    } else if (
      this.authService.isAuthorized === 'true' &&
      this.searchString.length > MINIMAL_REQUEST_LENGTH
    ) {
      this.getSearchResult(this.searchString);
    }
  }

  private getSearchResult(searchString: string) {
    this.filteredSearchResult = [];
    this.filteredSearchResult = this.searchObject.tasks.filter((task) => {
      const taskString = JSON.stringify(task);
      return taskString.includes(searchString);
    });
  }
}
