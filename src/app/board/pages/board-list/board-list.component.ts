import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BackgroundImgService } from '@app/board/services/background-img.service';

import { Board } from '@shared/types/board.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit, OnDestroy {
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

  boardsBackgroundImgsUrl: string[] = [];

  subscriptions = new Subscription();

  constructor(private http: HttpClient, private backgroundImgService: BackgroundImgService) {}

  ngOnInit(): void {
    this.boardsBackgroundImgsUrl = [];
    let subscription: Subscription;

    if (this.boards.length) {
      subscription = this.backgroundImgService
        .getBackgroundImgs(this.boards.length)
        .subscribe((res) => {
          res.forEach((imgObj) => {
            this.boardsBackgroundImgsUrl.push(imgObj.urls.small);
          });
        });

      this.subscriptions.add(subscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
