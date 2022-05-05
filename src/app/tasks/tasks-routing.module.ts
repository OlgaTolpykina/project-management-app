import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksPageComponent } from '@tasks/pages/tasks-page.component';
import { DataResolver } from '@tasks/resolver/data.resolver';

const routes: Routes = [
  { path: '', component: TasksPageComponent, resolve: { data: DataResolver } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
