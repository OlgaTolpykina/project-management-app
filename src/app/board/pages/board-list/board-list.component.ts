import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BackgroundImgService } from '@app/board/services/background-img.service';

import { Board } from '@shared/types/board.model';
import { Router } from '@angular/router';

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

  boardsBackgroundImgsUrl: string[] = [];

  constructor(
    private http: HttpClient,
    private backgroundImgService: BackgroundImgService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.boardsBackgroundImgsUrl = [];

    if (this.boards.length) {
      this.backgroundImgService.getBackgroundImgs(this.boards.length).subscribe((res) => {
        res.forEach((imgObj) => {
          this.boardsBackgroundImgsUrl.push(imgObj.urls.small);
        });
        console.log(this.boardsBackgroundImgsUrl);
      });
    }
  }

  openBoard(boardId: string) {
    console.log(boardId);
    this.router.navigateByUrl('/b/' + boardId);
  }
}
