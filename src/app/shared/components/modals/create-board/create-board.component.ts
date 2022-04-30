import { Component } from '@angular/core';
import { BoardService } from '@shared/services/board.service';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss'],
})
export class CreateBoardComponent {
  constructor(private boardService: BoardService) {}

  onCreateBoard(title: string) {
    if (!localStorage.getItem('token')) {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTVmYmExMC00NmYwLTQyNjEtYjM5ZC05NjdiM2ExMTFlYTYiLCJsb2dpbiI6IkFseWFseWExNCIsImlhdCI6MTY1MTMxMTk1OX0.R-k_-jutBzjqsSc7P3QR3DYZ6ehkwVlNguh3_E-LfT4';
      localStorage.setItem('token', token);
    }

    this.boardService.createBoard({ title }).subscribe((data) => console.log(data));
  }
}
