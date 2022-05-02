import { Component, OnInit } from '@angular/core';

import { BackgroundImgService } from '@app/board/services/background-img.service';

import { Board } from '@shared/types/board.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@app/redux/state.model';
import { selectBoards } from '../../../redux/selectors';
import { getAllBoards } from '../../../redux/actions/board.actions';
import { CreateBoardComponent } from '@board/components/create-board/create-board.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit {
  boards$: Observable<Board[]> = this.store.select(selectBoards);

  boardsBackgroundImgsUrl: string[] = [];

  unsubscribe$ = new Subject<void>();

  constructor(
    private backgroundImgService: BackgroundImgService,
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.boardsBackgroundImgsUrl = [];

    this.store.dispatch(getAllBoards());

    this.boards$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      if (value.length) {
        this.backgroundImgService
          .getBackgroundImgs(value.length)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((res) => {
            res.forEach((imgObj) => {
              this.boardsBackgroundImgsUrl.push(imgObj.urls.small);
            });
          });
      }
    });
  }

  openDialog(): void {
    this.dialog.open(CreateBoardComponent, {
      height: '400px',
      width: '300px',
    });
  }
}
