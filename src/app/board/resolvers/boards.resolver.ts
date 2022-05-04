import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectBoards } from '../../redux/selectors';
import { getAllBoards } from '../../redux/actions/board.actions';
@Injectable({
  providedIn: 'root',
})
export class BoardsResolver implements Resolve<any> {
  constructor(private store: Store) {}

  resolve() {
    return new Promise((resolve, reject) => {
      this.store
        .select(selectBoards)
        .pipe(
          map((boards: any) => {
            if (!boards) {
              this.store.dispatch(getAllBoards());
            }
            return boards;
          }),
        )
        .subscribe((boards) => {
          if (boards) {
            resolve(boards);
          } else if (boards === null) {
            reject(boards);
          }
        });
    });
  }
}
