import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { UpdateOrderService } from '@app/tasks/services/updateOrder/update-order.service';
import { getAllBoards, setSelectedBoardId } from '@app/redux/actions/board.actions';
import { MatDialog } from '@angular/material/dialog';
import { UserMessageComponent } from '@shared/user-message/user-message.component';
import { map, Observable, switchMap, take, tap } from 'rxjs';
import { selectSelectedBoardId } from '@app/redux/selectors/selectors';
import { AppState } from '@app/redux/state.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageForUser: string = '';

  redirectUrl: string = 'main';

  approveDeletion: boolean = false;

  request: HttpRequest<unknown> | null = null;

  selectedBoardId$: Observable<string> = this.store.select(selectSelectedBoardId);

  boardId = '';

  constructor(
    public router: Router,
    private http: HttpClient,
    private store: Store<AppState>,
    private updateOrder: UpdateOrderService,
    private dialog: MatDialog,
  ) {}

  public getMessageForUser(
    message: string,
    redirectUrl: string | null = null,
    timeout: number | null = null,
  ): void {
    this.messageForUser = message;
    const url = redirectUrl && !(redirectUrl === 'message') ? redirectUrl : 'main';
    this.openDialog();
    if (!(timeout === null)) {
      setTimeout(() => {
        this.messageForUser = '';
        this.router.navigate([url]);
      }, timeout);
    }
  }

  public getUserConfirmation(
    request: HttpRequest<unknown>,
    redirectUrl: string | null = null,
  ): void {
    this.messageForUser = 'delete confirmation';
    this.request = request;
    const url = redirectUrl ? redirectUrl : this.router.url;
    this.redirectUrl = url;
    this.openDialog();
  }

  openDialog(): void {
    this.dialog.open(UserMessageComponent, {
      height: '300px',
      width: '300px',
    });
  }

  public async sendDeleteRequest(): Promise<void> {
    this.approveDeletion = true;
    const url = (this.request as HttpRequest<unknown>).url;

    if (!url.includes('columns') && !url.includes('tasks')) {
      this.http
        .delete(url)
        .pipe(
          take(1),
          tap(() => (this.approveDeletion = false)),
          map(() => this.store.dispatch(getAllBoards())),
        )
        .subscribe();
    } else if (url.includes('columns') || url.includes('tasks')) {
      this.selectedBoardId$
        .pipe(
          take(1),
          map((boardId) => (this.boardId = boardId)),
          switchMap(() => {
            return this.http.delete(url).pipe(
              take(1),
              map(
                () => (
                  this.store.dispatch(setSelectedBoardId({ selectedBoardId: this.boardId })),
                  (this.approveDeletion = false)
                ),
              ),
            );
          }),
        )
        .subscribe();
    }
  }
}
