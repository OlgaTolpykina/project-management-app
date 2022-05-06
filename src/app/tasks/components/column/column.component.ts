import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '@app/redux/state.model';
import { Store } from '@ngrx/store';
import { Column } from '@shared/types/column.model';
import { Task } from '@shared/types/task.model';
import { ColumnService } from '@shared/services/column.service';
import { map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { selectSelectedBoardId } from '@app/redux/selectors/selectors';
import { UpdateOrderService } from '@app/tasks/services/updateOrder/update-order.service';
import { setSelectedBoardId } from '@app/redux/actions/board.actions';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  @Input() column: Column | undefined;

  selectedBoardId$: Observable<string> = this.store.select(selectSelectedBoardId);

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

  constructor(
    private store: Store<AppState>,
    private columnService: ColumnService,
    private updateOrder: UpdateOrderService,
  ) {}

  ngOnInit(): void {
    if (this.column) {
      this.name = this.column.title;
    }
  }

  onEdit() {
    this.isEditEnable = !this.isEditEnable;
  }

  onDelete(e: Event): void {
    e.stopPropagation();
    if (this.column?.id) {
      this.selectedBoardId$
        .pipe(
          map((id) => id),
          switchMap((id) => {
            return this.columnService.deleteColumn(id, this.column!.id!).pipe(
              map(() => this.store.dispatch(setSelectedBoardId({ selectedBoardId: id }))),
              switchMap(() => {
                return this.updateOrder.updateOrder();
              }),
            );
          }),
        )
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
