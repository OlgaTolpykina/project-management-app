import { Component, Input, OnInit } from '@angular/core';
import { Column } from '@shared/types/column.model';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit {
  @Input() column: Column | undefined;

  isEditEnable: boolean = false;

  name = 'Title';

  ngOnInit(): void {
    if (this.column) {
      this.name = this.column.title;
    }
  }

  onEdit() {
    this.isEditEnable = !this.isEditEnable;
  }
}
