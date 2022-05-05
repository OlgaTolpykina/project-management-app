import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksPageComponent } from '@app/tasks/pages/tasks-page.component';
import { SharedModule } from '@shared/shared.module';
import { ColumnComponent } from './components/column/column.component';
import { TaskComponent } from './components/task/task.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { CreateColumnComponent } from './components/create-column/create-column.component';

@NgModule({
  declarations: [
    TasksPageComponent,
    ColumnComponent,
    TaskComponent,
    OrderByPipe,
    CreateColumnComponent,
  ],
  imports: [CommonModule, TasksRoutingModule, SharedModule],
})
export class TasksModule {}
