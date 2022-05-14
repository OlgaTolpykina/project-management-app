import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/redux/state.model';
import { Subject, distinctUntilChanged, debounceTime } from 'rxjs';

import { setSelectedBoardId, clearSelectedBoard } from '@app/redux/actions/board.actions';
import { SearchObject } from '@shared/types/search-object.model';
import { BoardService } from '@shared/services/board.service';
import { UserAuthServiceService } from '@auth/services/user-auth-service.service';
import { Task } from '@shared/types/task.model';
import { Board } from '@shared/types/board.model';
import { SortSettings } from '@shared/types/sort-settings.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchObject: SearchObject = {
    tasks: [],
    boards: [],
    columns: [],
  };

  sortSettings: SortSettings = {
    sortBy: 'title',
    decrease: true,
  };

  filteredSearchResult: Task[] = [];

  searchString: string = '';

  selectedTask: Task | null = null;

  isTaskRequestNeed: boolean = true;

  openPage: boolean = false;

  MINIMAL_REQUEST_LENGTH: number = 2;

  searchTextChanged = new Subject<string>();

  searchTextChanged$ = this.searchTextChanged.asObservable();

  constructor(
    private boardService: BoardService,
    private authService: UserAuthServiceService,
    private store: Store<AppState>,
  ) {
    this.searchTextChanged
      .pipe(distinctUntilChanged(), debounceTime(200))
      .subscribe((searchString) => {
        this.getSearchResult(searchString);
      });
  }

  private async getAllBoards() {
    this.searchObject.boards = [];
    this.isTaskRequestNeed = false;
    this.boardService.getAllBoards().subscribe({
      next: (boards) => {
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
      this.boardService.getBoardById(element.id as string).subscribe({
        next: (board) => {
          (board as Board).columns!.forEach((el) => {
            this.searchObject.tasks = this.searchObject.tasks!.concat(el.tasks as Task[]);
            el.tasks?.forEach((task) => (task.boardId = board.id));
            console.log(this.searchObject.tasks);
          });
        },
        error: (err) => console.log('Error: ', err),
        complete: () => {
          console.log('tasks');
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
    if (this.authService.isAuthorized !== 'true') {
      this.authService.getMessageForUser('signIn first', 'home');
    } else if (
      this.authService.isAuthorized === 'true' &&
      this.searchString.length >= this.MINIMAL_REQUEST_LENGTH &&
      this.openPage
    ) {
      this.searchTextChanged.next(this.searchString);
      this.authService.router.navigate(['search']);
    }
  }

  private getSearchResult(searchString: string) {
    this.filteredSearchResult = [];
    this.filteredSearchResult = this.searchObject.tasks!.filter((task) => {
      task.userName = this.authService.users.find((user) => user.id === task?.userId)?.name || '';
      const taskString = task.title + task.description + task.userName + task.order.toString();
      return taskString.toLowerCase().includes(searchString.toLowerCase());
    });
    this.sortFilteredSearchResult();
  }

  public sortFilteredSearchResult() {
    this.filteredSearchResult.sort((a: Task, b: Task) => {
      if (!this.sortSettings.decrease) {
        return a[this.sortSettings.sortBy]!.toString() > b[this.sortSettings.sortBy]!.toString()
          ? 1
          : -1;
      } else
        return a[this.sortSettings.sortBy]!.toString() > b[this.sortSettings.sortBy]!.toString()
          ? -1
          : 1;
    });
  }

  public onSelect(task: Task) {
    this.selectedTask = task;
    const selectedBoardId = task.boardId!;
    console.log(task);
    console.log(selectedBoardId);
    this.store.dispatch(clearSelectedBoard());
    this.store.dispatch(setSelectedBoardId({ selectedBoardId }));
    this.authService.router.navigateByUrl('/b/' + selectedBoardId);
  }
}
