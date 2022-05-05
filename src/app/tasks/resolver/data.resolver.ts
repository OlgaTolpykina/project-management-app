import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { setSelectedBoardId } from '@app/redux/actions/board.actions';
import { selectSelectedBoard } from '@app/redux/selectors/board.selectors';
import { AppState } from '@app/redux/state.model';
import { Store } from '@ngrx/store';
import { Board } from '@shared/types/board.model';
import { map, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataResolver implements Resolve<Board | never> {
  private unsubscribe$?: Subscription;

  private selectedBoard$ = this.store.select(selectSelectedBoard);

  constructor(private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Board | never> {
    const selectedBoardId = <string>route.paramMap.get('id');

    return new Promise((resolve, reject) => {
      if (this.unsubscribe$) this.unsubscribe$.unsubscribe();
      this.unsubscribe$ = this.selectedBoard$
        .pipe(
          map((board) => {
            if (!board) {
              this.store.dispatch(setSelectedBoardId({ selectedBoardId }));
            }
            return board;
          }),
        )
        .subscribe((board) => {
          if (board) {
            resolve(board);
          } else if (board === null) {
            reject(board);
          }
        });
    });
  }
}
