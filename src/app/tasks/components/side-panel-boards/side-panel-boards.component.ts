import { Component, OnInit, OnDestroy } from '@angular/core';

import { BackgroundImgService } from '@app/board/services/background-img.service';

import { Board } from '@shared/types/board.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@app/redux/state.model';
import { Router } from '@angular/router';
import {
  setSelectedBoardId,
  clearSelectedBoard,
  getAllBoards,
} from '@app/redux/actions/board.actions';
import { MatDialog } from '@angular/material/dialog';
import { selectBoards } from '@app/redux/selectors/selectors';
import { RouteService } from '@core/services/route.service';
import { SearchService } from '@app/shared/services/search.service';

@Component({
  selector: 'app-side-panel-boards',
  templateUrl: './side-panel-boards.component.html',
  styleUrls: ['./side-panel-boards.component.scss'],
})
export class SidePanelBoardsComponent implements OnInit, OnDestroy {
  boards$: Observable<Board[] | undefined> = this.store.select(selectBoards);

  boardsBackgroundImgsUrl: string[] = [];

  unsubscribe$ = new Subject<void>();

  constructor(
    private backgroundImgService: BackgroundImgService,
    private store: Store<AppState>,
    private router: Router,
    private dialog: MatDialog,
    private route: RouteService,
    public searchService: SearchService,
  ) {}

  ngOnInit(): void {
    this.boardsBackgroundImgsUrl = [];
    this.store.dispatch(getAllBoards());

    this.boards$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      if (value?.length) {
        for (let i = 0; i <= value?.length; i++) this.boardsBackgroundImgsUrl.push('');
        this.backgroundImgService
          .getBackgroundImgs(value.length)
          .pipe()
          .subscribe((res) => {
            res.forEach((imgObj) => {
              this.boardsBackgroundImgsUrl.unshift(imgObj.urls.small);
            });
          });
      }
    });

    this.route.getRoute();
  }

  openBoard(board: Board) {
    const selectedBoardId = board.id!;
    this.store.dispatch(clearSelectedBoard());
    this.store.dispatch(setSelectedBoardId({ selectedBoardId }));
    this.router.navigateByUrl('/board/' + selectedBoardId);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }
}
