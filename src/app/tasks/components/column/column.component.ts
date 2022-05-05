import { Component, Input, OnInit } from '@angular/core';
import { Column } from '@shared/types/column.model';
import { Task } from '@shared/types/task.model';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit {
  @Input() column: Column | undefined;

  isEditEnable: boolean = false;

  name = 'Title';

  tasks: Task[] = [
    {
      id: '40af606c-c0bb-47d1-bc20-a2857242cde3',
      title: 'Task: pet the cat',
      order: 2,
      description: 'Domestic cat needs to be stroked gently',
      userId: '40af606c-c0bb-47d1-bc20-a2857242cde3',
      boardId: '8d3bad56-ad8a-495d-9500-18ae4d1de8dc',
      columnId: '08cc10f4-1aeb-4cce-9793-9fea8313b592',
    },
    {
      id: '40af606c-c0bb-47d1-bc20-a2857242cde3',
      title: 'Task: go for a walk',
      order: 1,
      description: 'AAAAAAAAAAAAAAAAAAAAAAAAA aa',
      userId: '40af606c-c0bb-47d1-bc20-a2857242cde3',
      boardId: '8d3bad56-ad8a-495d-9500-18ae4d1de8dc',
      columnId: '08cc10f4-1aeb-4cce-9793-9fea8313b592',
    },
    {
      id: '40af606c-c0bb-47d1-bc20-a2857242cde3',
      title: 'Task: watch a film',
      order: 1,
      description: 'BBBBBBBBBBBBBBB bbb',
      userId: '40af606c-c0bb-47d1-bc20-a2857242cde3',
      boardId: '8d3bad56-ad8a-495d-9500-18ae4d1de8dc',
      columnId: '08cc10f4-1aeb-4cce-9793-9fea8313b593',
    },
  ];

  taskOrder = 0;

  ngOnInit(): void {
    if (this.column) {
      this.name = this.column.title;

      this.tasks.forEach((task) => {
        this.taskOrder = task.order;
      });
    }
  }

  onEdit() {
    this.isEditEnable = !this.isEditEnable;
  }
}
