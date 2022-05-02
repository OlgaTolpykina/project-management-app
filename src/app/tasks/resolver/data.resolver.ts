import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { setSelectedBoardId } from '@app/redux/actions';
import { selectSelectedBoard } from '@app/redux/selectors';
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
      this.unsubscribe$ = this.selectedBoard$
        .pipe(
          map((board) => {
            if (!board) {
              console.log('request');
              this.store.dispatch(setSelectedBoardId({ selectedBoardId }));
            }
            console.log(board);
            return board;
          }),
        )
        .subscribe((board) => {
          if (board) {
            console.log(board);
            resolve(board);
          } else if (board === null) {
            reject(board);
          }
        });
    });
  }
}
