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
import { Board } from '@shared/types/board.model';

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

  openPage: boolean = false;

  constructor(
    private boardService: BoardService,
    private columnService: ColumnService,
    private taskService: TaskService,
    private authService: UserAuthServiceService,
    private store: Store<AppState>,
  ) {}

  private async getAllBoards() {
    this.isTaskRequestNeed = false;
    this.boardService.getAllBoards().subscribe({
      next: (boards) => {
        this.searchObject.boards = [];
        this.searchObject.boards = boards;
      },
      error: (err) => console.log('Error: ', err),
      complete: () => {
        console.log('boards');
        this.getAllTasks();
      },
    });
  }

  public async getAllTasks(): Promise<void> {
    let i: number = this.searchObject.boards!.length;
    this.searchObject.boards!.forEach((element) => {
      i = i - 1;
      this.boardService.getBoardById(element.id!).subscribe({
        next: (board) => {
          (board as Board).columns!.forEach((el) => {
            this.searchObject.tasks = this.searchObject.tasks!.concat(el.tasks as Task[]);
            console.log(this.searchObject.tasks);
          });
        },
        error: (err) => console.log('Error: ', err),
        complete: () => {
          if (i === 0) {
            this.openPage = true;
          }
        },
      });
    });
  }

  public async searchSubmit(): Promise<void> {
    if (this.isTaskRequestNeed || this.searchObject.tasks?.length === 0) {
      await this.getAllBoards();
    }
    console.log(this.searchString);
    console.log(this.searchObject);
    const MINIMAL_REQUEST_LENGTH: number = 2;
    if (this.authService.isAuthorized !== 'true') {
      this.authService.getMessageForUser('signIn first', 'home');
    } else if (
      this.authService.isAuthorized === 'true' &&
      this.searchString.length > MINIMAL_REQUEST_LENGTH &&
      this.openPage
    ) {
      this.getSearchResult(this.searchString);
      this.authService.router.navigate(['search']);
    }
  }

  private getSearchResult(searchString: string) {
    this.filteredSearchResult = [];
    this.filteredSearchResult = this.searchObject.tasks!.filter((task) => {
      task.userName = this.authService.users.find((user) => user.id === task?.userId)?.name || '';
      const taskString = task.title + task.description + task.userName + task.order.toString();
      console.log(taskString);
      console.log(taskString.includes(searchString));
      return taskString.toLowerCase().includes(searchString.toLowerCase());
    });
    console.log(this.filteredSearchResult);
  }

  public onSelect(task: Task) {
    this.selectedTask = task;
    const selectedBoardId = task.boardId!;
    this.store.dispatch(clearSelectedBoard());
    this.store.dispatch(setSelectedBoardId({ selectedBoardId }));
    this.authService.router.navigateByUrl('/b/' + selectedBoardId);
  }
}
