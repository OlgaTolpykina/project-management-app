import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/redux/state.model';

import { setSelectedBoardId, clearSelectedBoard } from '@app/redux/actions/board.actions';
import { SearchObject } from '@shared/types/search-object.model';
import { BoardService } from '@shared/services/board.service';
import { ColumnService } from '@shared/services/column.service';
import { TaskService } from '@shared/services/task.service';
import { UserAuthServiceService } from '@auth/services/user-auth-service.service';
import { Task } from '@shared/types/task.model';

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

  selectedTask: Task | null = null;

  isTaskRequestNeed: boolean = true;

  constructor(
    private boardService: BoardService,
    private columnService: ColumnService,
    private taskService: TaskService,
    private authService: UserAuthServiceService,
    private store: Store<AppState>,
  ) {}

  private async getAllBoards(): Promise<void> {
    this.boardService.getAllBoards().subscribe((boards) => {
      this.searchObject.boards = boards;
    });
  }

  public async getAllTasks(): Promise<void> {
    await this.getAllBoards();
    this.searchObject.boards!.forEach((board) => {
      this.columnService.getAllColumns(board.id).subscribe((columns) => {
        if (columns.length) {
          this.searchObject.columns = this.searchObject.columns!.concat(columns);
          columns.forEach((column) => {
            this.taskService.getAllTasks(board.id, column.id!).subscribe((tasks) => {
              if (!(tasks instanceof Error) && (tasks as Task[]).length) {
                this.searchObject.tasks = this.searchObject.tasks!.concat(tasks as Task[]);
              }
            });
          });
        }
      });
    });
  }

  public async searchSubmit(): Promise<void> {
    if (this.isTaskRequestNeed) await this.getAllTasks();
    console.log(this.searchString);
    console.log(this.searchObject);
    const MINIMAL_REQUEST_LENGTH: number = 2;
    if (this.authService.isAuthorized !== 'true') {
      this.authService.getMessageForUser('signIn first', 'home');
    } else if (
      this.authService.isAuthorized === 'true' &&
      this.searchString.length > MINIMAL_REQUEST_LENGTH
    ) {
      this.getSearchResult(this.searchString);
      this.authService.router.navigate(['search']);
    }
  }

  private getSearchResult(searchString: string) {
    this.filteredSearchResult = [];
    this.filteredSearchResult = this.searchObject.tasks?.length
      ? this.searchObject.tasks.filter((task) => {
          const taskString = JSON.stringify(task);
          return taskString.includes(searchString);
        })
      : [];
  }

  public onSelect(task: Task) {
    this.selectedTask = task;
    const selectedBoardId = task.boardId!;
    this.store.dispatch(clearSelectedBoard());
    this.store.dispatch(setSelectedBoardId({ selectedBoardId }));
    this.authService.router.navigateByUrl('/b/' + selectedBoardId);
  }
}
