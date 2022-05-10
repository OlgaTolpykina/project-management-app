import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { BoardService } from '@shared/services/board.service';
import { UpdateOrderService } from '@app/tasks/services/updateOrder/update-order.service';
import { getSelectedBoard, getAllBoards } from '@app/redux/actions/board.actions';
import { MatDialog } from '@angular/material/dialog';
import { UserMessageComponent } from '@shared/user-message/user-message.component';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageForUser: string = '';

  redirectUrl: string = 'main';

  approveDeletion: boolean = false;

  request: HttpRequest<unknown> | null = null;

  constructor(
    public router: Router,
    private http: HttpClient,
    private boardService: BoardService,
    private store: Store,
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
    this.router.navigate(['/message']);
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
    this.http.delete(url).subscribe(() => {
      this.boardService.getAllBoards().subscribe(() => {
        this.approveDeletion = false;
        this.store.dispatch(getAllBoards());
        this.updateOrder.updateOrder();
        if (url.includes('columns')) {
          this.store.dispatch(getSelectedBoard());
          this.updateOrder.updateOrder();
        }
        this.router.navigate([this.redirectUrl]);
      });
    });
  }
}
