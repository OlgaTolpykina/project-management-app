import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BackgroundImgService } from '@app/board/services/background-img.service';

import { Board } from '@shared/types/board.model';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@app/redux/state.model';
import { Router } from '@angular/router';
import { setSelectedBoard } from '@app/redux/actions';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit {
  boards: Board[] = [
    {
      id: '9a111e19-24ec-43e1-b8c4-13776842b8d5',
      title: 'Homework tasks',
    },
    {
      id: '9a111e19-24ec-43e1-b8c4-13776842b8d9',
      title: 'Main job tasks',
    },
  ];

  boards$: Observable<Board[]> = this.store.pipe(
    map((data) => {
      return [...data.boards.boards, ...this.boards];
    }),
  );

  boardsBackgroundImgsUrl: string[] = [];

  unsubscribe$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private backgroundImgService: BackgroundImgService,
    private store: Store<AppState>,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.boardsBackgroundImgsUrl = [];

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

  openBoard(board: Board) {
    const selectedBoardId = board.id!;
    this.store.dispatch(setSelectedBoard({ selectedBoard: board }));
    this.router.navigateByUrl('/b/' + selectedBoardId);
  }
}
