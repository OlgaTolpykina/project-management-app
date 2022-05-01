import { Component, OnInit, Input } from '@angular/core';

import { Board } from '@shared/types/board.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-item',
  templateUrl: './board-item.component.html',
  styleUrls: ['./board-item.component.scss'],
})
export class BoardItemComponent implements OnInit {
  @Input() board: Board | undefined;

  @Input() backgroundImgUrl: string | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('init board-item');
  }

  onDelete(e: Event): void {
    e.stopPropagation();
    this.router.navigate(['/home']);
  }
}
