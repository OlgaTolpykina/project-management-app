import { Injectable } from '@angular/core';
import { clearSelectedBoard, setSelectedBoardId } from '@app/redux/actions/board.actions';
import { AppState } from '@app/redux/state.model';
import { UserAuthServiceService } from '@auth/services/user-auth-service.service';
import { Store } from '@ngrx/store';
import { SortSettings } from '@shared/types/sort-settings.model';
import { Subject, distinctUntilChanged, debounceTime } from 'rxjs';
import { Board } from '../types/board.model';
import { SearchObject } from '../types/search-object.model';
import { Task } from '../types/task.model';
import { BoardService } from './board.service';

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

  MINIMAL_REQUEST_LENGTH: number = 1;

  searchTextChanged = new Subject<string>();

  searchTextChanged$ = this.searchTextChanged.asObservable();

  allTasksReady = new Subject<boolean>();

  allTasksReady$ = this.allTasksReady.asObservable();

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

    this.allTasksReady.pipe().subscribe((openPage) => {
      if (openPage) this.searchSubmit();
    });
  }

  private async getAllBoards() {
    this.searchObject.boards = [];
    this.isTaskRequestNeed = false;
    this.boardService.getAllBoards().subscribe({
      next: (boards) => {
        this.searchObject.boards = boards;
      },
      complete: () => {
        this.getAllTasks();
      },
    });
  }

  public async getAllTasks(): Promise<void> {
    this.searchObject.tasks = [];
    let i: number = this.searchObject.boards!.length;
    this.searchObject.boards!.forEach((element) => {
      i = i - 1;
      this.boardService.getBoardById(element.id as string).subscribe({
        next: (board) => {
          (board as Board).columns!.forEach((el) => {
            this.searchObject.tasks = this.searchObject.tasks!.concat(el.tasks as Task[]);
            el.tasks?.forEach((task) => (task.boardId = board.id));
          });
        },
        complete: () => {
          if (i === 0) {
            this.openPage = true;
            this.allTasksReady.next(this.openPage);
          }
        },
      });
    });
  }

  public async searchSubmit(): Promise<void> {
    this.authService.redirectUrl =
      this.authService.router.url === '/search'
        ? this.authService.redirectUrl
        : this.authService.router.url;
    if (this.searchString === '') {
      this.authService.router.navigate([this.authService.redirectUrl || 'main']);
    }
    if (this.isTaskRequestNeed || this.searchObject.tasks?.length === 0) {
      await this.getAllBoards();
    }
    if (this.authService.isAuthorized !== 'true') {
      this.authService.getMessageForUser('signIn first', 'home');
    } else if (
      this.authService.isAuthorized === 'true' &&
      this.searchString.length >= this.MINIMAL_REQUEST_LENGTH &&
      this.openPage
    ) {
      this.searchTextChanged.next(this.searchString);
      if (this.searchString !== '') this.authService.router.navigate(['search']);
    }
  }

  private getSearchResult(searchString: string) {
    this.filteredSearchResult = [];
    this.filteredSearchResult = this.searchObject.tasks!.filter((task) => {
      task.userName =
        this.authService.users.find((user) => user.id === task?.userId)?.name || '------';
      const taskString = task.title + task.description + task.userName + task.order.toString();
      return taskString.toLowerCase().includes(searchString.toLowerCase());
    });
    this.sortFilteredSearchResult(this.sortSettings.sortBy);
  }

  public sortFilteredSearchResult(sortBy: keyof Task) {
    this.sortSettings.decrease =
      sortBy === this.sortSettings.sortBy
        ? !this.sortSettings.decrease
        : this.sortSettings.decrease;
    this.sortSettings.sortBy = sortBy;
    this.filteredSearchResult.sort((a: Task, b: Task) => {
      if (this.sortSettings.decrease) {
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
    this.store.dispatch(clearSelectedBoard());
    this.store.dispatch(setSelectedBoardId({ selectedBoardId }));
    this.authService.router.navigateByUrl('/board/' + selectedBoardId);
    this.searchString = '';
  }
}
