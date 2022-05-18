import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { BoardModule } from '@app/board/board.module';
import { TasksPageComponent } from '@app/tasks/pages/tasks-page.component';
import { SharedModule } from '@shared/shared.module';
import { ColumnComponent } from './components/column/column.component';
import { TaskComponent } from './components/task/task.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { CreateColumnComponent } from './components/create-column/create-column.component';
import { UpdateTaskComponent } from './components/update-task/update-task.component';
import { FilterExecPipe } from './pipes/filter-exec.pipe';
import { FilterDonePipe } from './pipes/filter-done.pipe';
import { SidePanelBoardsComponent } from './components/side-panel-boards/side-panel-boards.component';

@NgModule({
  declarations: [
    TasksPageComponent,
    ColumnComponent,
    TaskComponent,
    OrderByPipe,
    CreateTaskComponent,
    CreateColumnComponent,
    UpdateTaskComponent,
    FilterExecPipe,
    FilterDonePipe,
    SidePanelBoardsComponent,
  ],
  imports: [CommonModule, TasksRoutingModule, SharedModule, BoardModule],
  exports: [TaskComponent, SidePanelBoardsComponent],
})
export class TasksModule {}
