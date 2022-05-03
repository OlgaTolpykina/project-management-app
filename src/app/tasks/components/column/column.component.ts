import { Component } from '@angular/core';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent {
  isEditEnable: boolean = false;

  name = 'Title';

  onEdit() {
    this.isEditEnable = !this.isEditEnable;
  }
}
